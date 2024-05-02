const { OpenAI } = require("openai");
const functions = require("./functions");
const {
  getTask,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../db/task");
const readline = require("readline");
require("dotenv").config();

type AssistantResponse = {
  message: string;
  data: any;
  componentType: "card" | "table" | null;
};

/**
 * The AssistantManager class represents a manager for an AI-powered chat assistant.
 * It provides methods to start a conversation, process user input, and handle assistant actions.
 */
class AssistantManager {
  openai: any;
  assistantId: any;
  thread: any;
  run: any;
  constructor() {
    this.openai = new OpenAI();
  }

  /**
   * Starts a conversation with the AI-powered chat assistant.
   *
   * @returns {Promise<void>} A promise that resolves when the conversation is started.
   */
  async startConversation() {
    const assistant = await this.openai.beta.assistants.create({
      model: "gpt-3.5-turbo",
      name: "Lookout Assistant",
      instructions: `
        You are an AI-powered chat assistant named 'Lookout'. You assist users
        to manage tasks within a web application. You have some functions
        available for use to interact with tasks. Always confirm user commands
        (any create, update, or delete action) and clarify ambiguous requests
        to ensure accuracy in task management operations before function calling.
        You must produce JSON for your output. Your output will have two fields:
        1. message: string - the text response from the assistant
        2. data: any - the data returned from the function call
      `,
      response_format: { type: "json_object" },
      tools: functions.tools,
    });

    this.assistantId = assistant.id;
    // console.log("Created Assistant with Id: " + this.assistantId);

    this.thread = await this.openai.beta.threads.create();
    // console.log("Created thread with Id: " + this.thread.id);
  }

  /**
   * Processes the user input and returns an AssistantResponse.
   * @param userInput - The user input to process.
   * @returns A Promise that resolves to an AssistantResponse.
   */
  async processUserInput(userInput: string): Promise<AssistantResponse> {
    const userMessage = await this.openai.beta.threads.messages.create(
      this.thread.id,
      {
        role: "user",
        content: userInput,
      }
    );
    // console.log("Message added to thread: " + userMessage.id);

    await this.createRun();
    const messages = await this.openai.beta.threads.messages.list(
      this.thread.id
    );

    const firstMessageContent = messages.data[0].content[0].text.value;
    const parsedContent = JSON.parse(firstMessageContent);
    let { message, data } = parsedContent;

    // Ensure data is always an array if not null
    if (data != null && !Array.isArray(data)) {
      data = [data];
    }

    let componentType: "card" | "table" | null = null;
    if (data !== null) {
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
    };

    return assistantResponse;
  }

  /**
   * Creates a new run for the assistant and polls for its status.
   * If the run requires action, it handles the action. Otherwise, it completes without needing additional actions.
   */
  async createRun() {
    this.run = await this.openai.beta.threads.runs.createAndPoll(
      this.thread.id,
      {
        assistant_id: this.assistantId,
        additional_instructions: "Please address the user by their name.",
      }
    );

    // console.log("Run status: " + this.run.status);

    if (this.run.status === "requires_action") {
      await this.handleRequiresAction();
    } else {
      // console.log("Run completed without needing additional actions.");
    }
  }

  /**
   * Handles the requires_action state by executing the necessary tool functions and submitting the tool outputs.
   * @returns {Promise<void>} A promise that resolves when the tool outputs are submitted.
   */
  async handleRequiresAction() {
    // console.log("Handling requires_action...");
    const toolOutputs = await Promise.all(
      this.run.required_action.submit_tool_outputs.tool_calls.map(
        async (tool: any) => {
          const parsedArguments = JSON.parse(tool.function.arguments);
          // Shows what function and arguments are being called
          console.log(
            `Arguments for ${tool.function.name}:`,
            tool.function.arguments
          );
          // Handle function execution based on the function name and arguments.
          let output;
          switch (tool.function.name) {
            case "getTask":
              output = await getTask(tool.function.parsedArguments);
              break;
            case "getTasks":
              output = await getTasks(tool.function.parsedArguments);
              break;
            case "createTask":
              output = await createTask(tool.function.parsedArguments);
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
      // console.log("Tool outputs submitted successfully.");
    } else {
      // console.log("No tool outputs to submit.");
    }
  }
}

const manager = new AssistantManager();
manager.startConversation();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "user > ",
});

rl.prompt();
rl.on("line", async (input: any) => {
  const response = await manager.processUserInput(input);

  console.log("Message: " + response.message);
  console.log("Data: " + JSON.stringify(response.data, null, 2));
  console.log("Component Type: " + response.componentType);
  rl.prompt();
});
