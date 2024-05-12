import { OpenAI } from "openai";
const functions = require("./functions.json");
import { getTask, getTasks, createTask, updateTask, deleteTask } from "../db/task";
import { getProject, getProjects, createProject, updateProject, deleteProject  } from "../db/project";
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
  currentStatus: string;

  constructor() {
    this.openai = new OpenAI();
    this.currentStatus = "pending";
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
        to manage tasks within a web application. Here are your guidelines:
        1. NEVER call a function unless the user SPECIFICALLY ask to search, create, update, or delete. They must provide you with all fields necessary. Otherwise, just respond!
        3. Always clarify ambiguous requests. You are NEVER allowed to make up data for a variable. Let the user know what they need to provide you.
        4. If the user requests for a create, update, or delete operation, ask the user to provide any required fields for the operation. Then, ask the user if they want to confirm the operation. By default, the status will be "pending" until the user confirms or cancels the write operation.
        5. You must produce JSON for your output. This JSON will have three fields:
          message: string - the text response from the assistant
          data: any - the data returned from the function call.
          status: string - The status of the user request. Can be "pending", "confirmed", "canceled". 
        6. For a read operation (any get request), status will default to "confirmed". For a write operation - which is any create, update, or delete request - status will default to "pending". If the user confirms that the write request can be carried out, change this to "confirmed". If the user cancels their request, change this to "canceled". 
        Do NOT change this status without the user's explicit confirmation or cancelation. It should always be pending until the user confirms the write operation."
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
    // Add the user input to the conversation thread
    await this.openai.beta.threads.messages.create(
      this.thread.id,
      {
        role: "user",
        content: userInput,
      }
    );

    // Directly check for confirmation in the userInput
    if (userInput.toLowerCase().includes("confirm")) {
      this.currentStatus = "confirmed"; // Set status to confirmed immediately upon user confirmation
      console.log("Status manually set to " + this.currentStatus);
    }

    await this.createRun();

    const messages = await this.openai.beta.threads.messages.list(
      this.thread.id
    );

    // Parse the first message content to extract the assistant response
    const firstMessageContent = messages.data[0].content[0].text.value;
    const parsedContent = JSON.parse(firstMessageContent);
    let { message, data, status } = parsedContent;
    this.currentStatus = status;

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
          console.log('Run status: ' + this.run.status);

          // Handle function execution based on the function name and arguments.
          let output;
          
          // Check if the tool function requires confirmation and if it's confirmed based on the currentStatus
          const allowedFunctions = ["createTask", "updateTask", "deleteTask", "createProject", "updateProject", "deleteProject"];
          if (allowedFunctions.includes(tool.function.name) && this.currentStatus !== "confirmed") { 
            output = "Action requires confirmation.";
          } else {
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
                output = await updateTask(parsedArguments);
                break;
              case "deleteTask":
                output = await deleteTask(parsedArguments);
                break;
              case "getProject":
                output = await getProject(parsedArguments);
                break;
              case "getProjects":
                output = await getProjects(parsedArguments);
                break;
              case "createProject":
                output = await createProject(parsedArguments);
                break;
              case "updateProject":
                output = await updateProject(parsedArguments);
                break;
              case "deleteProject":
                output = await deleteProject(parsedArguments);
                break;
              default:
                output = "Function not supported";
                break;
            }
          }
          console.log("Tool output: " + JSON.stringify(output));
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
