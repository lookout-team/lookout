import { OpenAI } from "openai";
import { AssistantResponse, ComponentType } from "./types";
import { initializeTools, mapFunctions } from "./tools";
require("dotenv").config();
import * as fs from "fs";

/**
 * Provides an interface for the AI chat assistant.
 */
export class LookoutAssistant {
  openai: any;
  assistantId: any;
  threadId: any;
  tools: any;
  functions: any;

  constructor() {
    this.openai = new OpenAI();
    this.tools = initializeTools();
    this.functions = mapFunctions();
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
    // Send user input to assistant and destructure raw response
    const response = await this.queryAssistant(userInput);
    let { message, data, status } = JSON.parse(response);

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

    // Return processed response
    const assistantResponse: AssistantResponse = {
      message: message,
      data: data,
      componentType: componentType,
      status: status,
    };

    return assistantResponse;
  }

  /**
   * Sends user input to the AI assistant, polls for its status,
   * performs required actions (if any), and returns messages.
   * 
   * @param {string} userInput - User input
   * @returns {string} - Raw JSON response returned by AI Assistant
   */
  async queryAssistant(userInput: string) {
    const threads = this.openai.beta.threads;

    await threads.messages.create(this.threadId, {
      role: "user",
      content: userInput,
    });

    const additional_instructions = `Because write operations are expensive
    and consequential, you must always ask the user to review a summary of any
    planned write changes. You can only call create, update, or delete functions
    once you requested and recieved explicit confirmation from the user!`;

    const run = await threads.runs.createAndPoll(this.threadId, {
      assistant_id: this.assistantId,
      additional_instructions: additional_instructions,
    });

    if (run.status === "requires_action") {
      await this.handleRequiresAction(run);
    }

    const messages = await threads.messages.list(this.threadId);
    const response = messages.data[0].content[0].text.value;
    return response;
  }

  /**
   * Executes tools and submits tool outputs, if required.
   * @param {any} run - Run
   */
  async handleRequiresAction(run: any) {
    // Execute functions
    const toolOutputs = await Promise.all(
      run.required_action.submit_tool_outputs.tool_calls.map(
        async (tool: any) => {
          const args = JSON.parse(tool.function.arguments);
          const func = this.functions[tool.function.name];

          switch (tool.function.name) {
            case "createProject":
              args.last_updated = null;
              args.current_sprint_id = null;
              break;
          }

          const output = await func(args);

          return {
            tool_call_id: tool.id,
            output: JSON.stringify(output),
          };
        }
      )
    );

    // Submit tool outputs
    if (toolOutputs.length > 0) {
      await this.openai.beta.threads.runs.submitToolOutputsAndPoll(
        this.threadId,
        run.id,
        { tool_outputs: toolOutputs }
      );
    }
  }
}
