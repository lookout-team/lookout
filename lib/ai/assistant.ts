
const { OpenAI } = require("openai");
const functions = require("./functions");
const mocks = require("./mockFunctions");
require("dotenv").config();

type AssistantResponse = {
  message: string;
  data: any;
  componentType: "board" | "table" | undefined;
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
      `,
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
    
    const runResult = await this.createRun();

    const assistantResponse: AssistantResponse = {
      message: runResult ? runResult.response : "",
      data: runResult ? runResult.data : null,
      componentType: "board",
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
    
    const messages = await this.openai.beta.threads.messages.list(
      this.thread.id
    );
    // Retrieve assistant response from the thread, index 0 should always be
    // the assistant's response if working correctly
    // console.log("assistant >", messages.data[0].content[0].text.value);

    console.log("Run status: " + this.run.status);
    
    // No function calls needed
    if (this.run.status === "completed") {
      const response = messages.data[0].content[0].text.value
      return {response, data: null}
    // Function calls needed
    } else if (this.run.status === "requires_action") {
      const handleResult = await this.handleRequiresAction();
      console.log("Run status: " + this.run.status);
      const response = messages.data[0].content[0].text.value
      return {response, data: handleResult}
    } else {
      console.log("Run completed without needing additional actions.");
    }
  }

  async handleRequiresAction() {
    let data;
    
    console.log("Handling requires_action...");
    const toolOutputs =
      this.run.required_action.submit_tool_outputs.tool_calls.map(
        (tool: { function: { name: string; arguments: any }; id: any }) => {
          // Simulate function execution. Replace this with actual function
          // calls and handle arguments appropriately.
          data = mocks(tool.function.name, tool.function.arguments);
          return {
            tool_call_id: tool.id,
            output: data,
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

    return data;
  }
}

const manager = new AssistantManager();
manager.startConversation();

const readLine = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "user > ",
});

readLine.on("line", async (input: any) => {
  const response = await manager.processUserInput(input);
  console.log(response.message);
  console.log(response.data);
  console.log(response.componentType);
  readLine.prompt();
});
