import { OpenAI } from "openai";
import { AssistantResponse, ComponentType } from "./types";
import { initializeTools, readFunctions, writeFunctions } from "./tools";
require("dotenv").config();
import * as fs from "fs";

/**
 * Provides an interface for the AI chat assistant.
 */
export class LookoutAssistant {
  openai: any;
  assistantId: any;
  threadId: any;
  currentRun: any;
  tools: any;
  readFunctions: Record<string, (...args: any) => unknown>;
  writeFunctions: Record<string, (...args: any) => unknown>;
  actionConfirmed: boolean;
  responseType: "read" | "write";

  constructor() {
    this.openai = new OpenAI();
    this.tools = initializeTools();
    this.readFunctions = readFunctions();
    this.writeFunctions = writeFunctions();
    this.actionConfirmed = false;
    this.responseType = "read";
  }

  /**
   * Starts a new conversation thread.
   */
  async startConversation() {
    const instructionsPath = `${process.cwd()}/lib/ai/instructions.txt`;
    const instructions = fs.readFileSync(instructionsPath, "utf-8");

    const assistant = await this.openai.beta.assistants.create({
      model: "gpt-3.5-turbo",
      name: "Lookout Assistant",
      temperature: 0.4,
      instructions: instructions,
      response_format: { type: "json_object" },
      tools: this.tools,
    });
    this.assistantId = assistant.id;

    const thread = await this.openai.beta.threads.create();
    this.threadId = thread.id;
  }

  /**
   * Processes the user input and returns a response.
   *
   * @param {string} userInput - User input
   * @returns {AssistantResponse} - Response returned by the Assistant API,
   * containing the message, data, and type of component to render
   */
  async processUserInput(userInput: string): Promise<AssistantResponse> {
    // Check if message is a confirmation action
    this.actionConfirmed = userInput === "Confirm action";

    // Send user input to assistant and destructure raw response
    const response = await this.queryAssistant(userInput);
    let parsedResponse = null;

    try {
      parsedResponse = JSON.parse(response);
    } catch {
      return {
        message: "An error occurred, please try again.",
        data: this.currentRun.last_error,
        componentType: null,
        status: "canceled",
        type: "read",
      };
    }

    let { message, data } = parsedResponse;

    // Ensure data is always an array if not null
    let componentType: ComponentType = null;

    if (data !== null) {
      if (!Array.isArray(data)) {
        data = [data];
      }

      if (data.length === 1) {
        componentType = "card";
      } else if (data.length > 1) {
        componentType = "table";
      }
    }

    // Status
    let status: "confirmed" | "canceled" | "pending";
    status = this.actionConfirmed ? "confirmed" : "pending";
    status = userInput === "Cancel action" ? "canceled" : status;

    // Compile response props
    const assistantResponse: AssistantResponse = {
      message: message,
      data: data,
      componentType: componentType,
      status: status,
      type: this.responseType,
    };

    return assistantResponse;
  }

  /**
   * Sends user input to the AI assistant, polls for its status,
   * performs required actions (if any), and returns messages.
   *
   * @param {string} userInput - User input
   * @returns - Raw JSON response returned by AI Assistant
   */
  async queryAssistant(userInput: string) {
    const threads = this.openai.beta.threads;

    if (this.currentRun && this.currentRun.status !== "completed") {
      try {
        await threads.runs.cancel(this.threadId, this.currentRun.id);
      } catch {}
    }

    await threads.messages.create(this.threadId, {
      role: "user",
      content: userInput,
    });

    const additional_instructions = `Because write operations are expensive
    and consequential, you must always ask the user to review a summary of any
    planned write changes. You can only call create, update, or delete functions
    once you requestedh and recieved explicit confirmation from the user!`;

    this.currentRun = await threads.runs.createAndPoll(this.threadId, {
      assistant_id: this.assistantId,
      additional_instructions: additional_instructions,
    });

    if (this.currentRun.status === "requires_action") {
      await this.handleRequiresAction();
    }

    const messages = await threads.messages.list(this.threadId);
    const response = messages.data[0].content[0].text.value;
    return response;
  }

  /**
   * Executes tools and submits tool outputs, if required.
   */
  async handleRequiresAction() {
    // Execute functions
    const toolOutputs = await Promise.all(
      this.currentRun.required_action.submit_tool_outputs.tool_calls.map(
        async (tool: any) => {
          // Parse function and arguments
          const toolName = tool.function.name;
          const args = this.parseArguments(toolName, tool.function.arguments);

          // Determine if function is a read or write operation
          const isWriteOperation = toolName in this.writeFunctions;

          this.responseType = isWriteOperation ? "write" : "read";

          const func = isWriteOperation
            ? this.writeFunctions[toolName]
            : this.readFunctions[toolName];

          // Cancel function call if no explicit user confirmation
          if (isWriteOperation && this.actionConfirmed === false) {
            return {
              tool_call_id: tool.id,
              output: JSON.stringify({
                Error: "Cannot write data without user confirmation",
              }),
            };
          }

          // Call tool and return tool output
          const output = await func(args);

          return {
            tool_call_id: tool.id,
            output: JSON.stringify(output),
          };
        }
      )
    );

    // Submit all tool outputs
    if (toolOutputs.length > 0) {
      await this.openai.beta.threads.runs.submitToolOutputsAndPoll(
        this.threadId,
        this.currentRun.id,
        { tool_outputs: toolOutputs }
      );
    }
  }

  /**
   * Parses Assistant-generated arguments.
   * 
   * @param toolName - Tool name
   * @param toolArgs - Tool arguments
   * @returns - Arguments with correct types
   */
  parseArguments(toolName: string, toolArgs: string) {
    let ids = [];
    let optionals = [];
    const args = JSON.parse(toolArgs);

    switch (toolName) {
      case "createProject":
        args.last_updated = null;
        args.current_sprint_id = null;
        break;

      case "createSprint":
        args.start_date = new Date(args.start_date);
        args.planned_capacity = +args.planned_capacity;
        args["end_date"] = args.hasOwnProperty("end_date")
          ? args["end_date"]
          : null;
        break;

      case "createTask":
        optionals = [
          "requirements",
          "acceptance_criteria",
          "assigned_to",
          "priority_id",
          "status_id",
        ];

        ids = ["assigned_to", "priority_id", "status_id"];

        for (const optional of optionals) {
          args[optional] = args.hasOwnProperty(optional)
            ? args[optional]
            : null;
        }

        for (const id of ids) {
          args[id] = args[id] ? +args[id] : null;
        }
        break;
    }

    return args;
  }
}
