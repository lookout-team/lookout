
const { OpenAI } = require("openai");
const functions = require("./functions");
const mocks = require("./mockFunctions");
const readline = require("readline");
require("dotenv").config();

type AssistantResponse = {
  message: string;
  data: any;
  componentType: "card" | "table" | null;
};

class AssistantManager {
  openai: any;
  assistantId: any;
  thread: any;
  run: any;
  constructor() {
    this.openai = new OpenAI();
  }

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
      response_format: { "type": "json_object" },
      tools: functions.tools,
    });

    this.assistantId = assistant.id;
    console.log("Created Assistant with Id: " + this.assistantId);

    this.thread = await this.openai.beta.threads.create();
    console.log("Created thread with Id: " + this.thread.id);
  }

  // Previously addMessageToThread
  async processUserInput(userInput: string): Promise<AssistantResponse> {
    const userMessage = await this.openai.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: userInput,
    });
    console.log("Message added to thread: " + userMessage.id);
    
    await this.createRun();
    const messages = await this.openai.beta.threads.messages.list(
      this.thread.id
    );
    
    // Option to log all messages in the thread
    // messages.getPaginatedItems().forEach((message: any) => {
    //   console.log(JSON.stringify(message, null, 2));
    // });
    
    const firstMessageContent = messages.data[0].content[0].text.value;
    const parsedContent = JSON.parse(firstMessageContent);
    const message = parsedContent.message;
    const data = parsedContent.data;
    
    let componentType: "card" | "table" | null = null;
    if (data !== null && Array.isArray(data)) {
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

  async createRun() {
    this.run = await this.openai.beta.threads.runs.createAndPoll(
      this.thread.id,
      {
        assistant_id: this.assistantId,
        additional_instructions: "Please address the user by their name.",
      }
    );

    console.log("Run status: " + this.run.status);
    
    // No function calls needed
    if (this.run.status === "completed") {
      console.log("Run status: " + this.run.status);
    // Function calls needed
    } else if (this.run.status === "requires_action") {
      await this.handleRequiresAction();
    } else {
      console.log("Run completed without needing additional actions.");
    }
  }

  async handleRequiresAction() {
    console.log("Handling requires_action...");
    const toolOutputs =
      this.run.required_action.submit_tool_outputs.tool_calls.map(
        (tool: { function: { name: string; arguments: any }; id: any }) => {
          // Simulate function execution. Replace this with actual function
          // calls and handle arguments appropriately.
          const output = mocks(tool.function.name, tool.function.arguments);
          return {
            tool_call_id: tool.id,
            output: JSON.stringify(output),
          };
        }
      );

    // Submit all tool outputs at once after collecting them in a list
    if (toolOutputs.length > 0) {
      this.run = await this.openai.beta.threads.runs.submitToolOutputsAndPoll(
        this.thread.id,
        this.run.id,
        { tool_outputs: toolOutputs }
      );
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
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
