import { OpenAI } from "openai";
const functions = require("./functions.json");
import { getTask, getTasks, createTask, updateTask, deleteTask } from "../db/task";
import { AssistantResponse, ComponentType } from "./types";
require("dotenv").config();


/**
 * Provides an interface for the AI chat assistant.
 */
export class AssistantManager {
  openai: any;
  assistantId: any;
  thread: any;
  run: any;

  constructor() {
    this.openai = new OpenAI();
  }

  /**
   * Starts a new conversation thread.
   */
  async startConversation() {
    const assistant = await this.openai.beta.assistants.create({
      model: "gpt-3.5-turbo",
      name: "Lookout Assistant",
      instructions: `
        You are an AI-powered chat assistant named 'Lookout'. You assist users
        to manage tasks within a web application. You have some functions
        available for use to interact with tasks. If a user makes create,
        update, or delte request, always ask the user to confirm before making
        the write operationl.Always clarify ambiguous requests
        to ensure accuracy in task management operations before function calling.
        You must produce JSON for your output. Your output will have three fields:
        1. message: string - the text response from the assistant
        2. data: any - the data returned from the function call
        3. status: string - the status of the operation, will be pending until user confirms
      `,
      response_format: { type: "json_object" },
      tools: functions.tools,
    });

    this.assistantId = assistant.id;
    this.thread = await this.openai.beta.threads.create();
  }

  /**
   * Processes the user input and returns a response.
   * @param {string} userInput - The user input to process.
   * @returns {AssistantResponse} - Response returned by the Assistant API,
   * containing the message, data, and type of component to render.
   */
  async processUserInput(userInput: string): Promise<AssistantResponse> {
    await this.openai.beta.threads.messages.create(
      this.thread.id,
      {
        role: "user",
        content: userInput,
      }
    );

    await this.createRun();

    const messages = await this.openai.beta.threads.messages.list(
      this.thread.id
    );

    const firstMessageContent = messages.data[0].content[0].text.value;
    const parsedContent = JSON.parse(firstMessageContent);
    let { message, data, status } = parsedContent;

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

    const assistantResponse: AssistantResponse = {
      message: message,
      data: data,
      componentType: componentType,
      status: status,
    };

    return assistantResponse;
  }

  /**
   * Creates a new run for the assistant and polls for its status.
   * If the run requires action, it handles the action. 
   * Otherwise, it completes without needing additional actions.
   */
  async createRun() {
    this.run = await this.openai.beta.threads.runs.createAndPoll(
      this.thread.id,
      {
        assistant_id: this.assistantId,
        additional_instructions: "Please address the user by their name.",
      }
    );

    if (this.run.status === "requires_action") {
      await this.handleRequiresAction();
    }
  }

  /**
   * Handles the requires_action state by executing the 
   * necessary tool functions and submitting the tool outputs.
   */
  async handleRequiresAction() {
    const toolOutputs = await Promise.all(
      this.run.required_action.submit_tool_outputs.tool_calls.map(
        async (tool: any) => {
          const parsedArguments = JSON.parse(tool.function.arguments);

          // Shows what function and arguments are being called
          console.log(
            `Arguments for ${tool.function.name}:`,
            tool.function.arguments
          );
          console.log("Arguments as Object: " + parsedArguments);

          // Handle function execution based on the function name and arguments.
          let output;

          switch (tool.function.name) {
            case "getTask":
              output = await getTask(parsedArguments);
              break;
            case "getTasks":
              output = await getTasks(parsedArguments);
              break;
            case "createTask":
              output = await createTask(parsedArguments);
              break;
            case "updateTask":
              output = await updateTask(tool.function.parsedArguments);
              break;
            case "deleteTask":
              output = await deleteTask(tool.function.parsedArguments.id);
              break;
            default:
              output = "Function not supported";
              break;
          }
          
          return {
            tool_call_id: tool.id,
            output: JSON.stringify(output),
          };
        }
      )
    );

    // Submit all tool outputs at once after collecting them in a list
    if (toolOutputs.length > 0) {
      this.run = await this.openai.beta.threads.runs.submitToolOutputsAndPoll(
        this.thread.id,
        this.run.id,
        { tool_outputs: toolOutputs }
      );
    }
  }
}
