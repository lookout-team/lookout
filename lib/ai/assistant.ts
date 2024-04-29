const { OpenAI } = require("openai");
const functions = require("./functions");
const mocks = require("./mockFunctions");
require("dotenv").config();

class AssistantManager {
  openai: any;
  assistantId: any;
  thread: any;
  run: any;
  constructor() {
    this.openai = new OpenAI();
  }

  async createAssistant() {
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
    return assistant;
  }

  async createThread() {
    this.thread = await this.openai.beta.threads.create();

    console.log("Created thread with Id: " + this.thread.id);
  }

  async addMessageToThread(message: any) {
    const msg = await this.openai.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: message,
    });
    console.log("Message added to thread: " + msg.id);
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

    if (this.run.status === "completed") {
      await this.printAssistantMessage();
    } else if (this.run.status === "requires_action") {
      await this.handleRequiresAction();
      console.log("Run status: " + this.run.status);
      await this.printAssistantMessage();
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
            output: output,
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

  async printAssistantMessage() {
    const messages = await this.openai.beta.threads.messages.list(
      this.thread.id
    );

    // Retrieve assistant response from the thread, index 0 should always be
    // the assistant's response if working correctly
    console.log("assistant >", messages.data[0].content[0].text.value);

    // Use for printing JSON log of messages in thread
    // messages.getPaginatedItems().forEach((message: any) => {
    //   console.log(JSON.stringify(message, null, 2));
    // });

    // Use for printing a log of all messages in the thread
    // for (const message of messages.data.reverse()) {
    //   console.log(`${message.role} > ${message.content[0].text.value}`);
    // }
  }

  async startConversation() {
    await this.createAssistant();
    await this.createThread();

    const readLine = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "user > ",
    });

    readLine.prompt();
    readLine.on("line", async (input: any) => {
      await this.addMessageToThread(input);
      await this.createRun();
      readLine.prompt();
    });
  }
}

const manager = new AssistantManager();
manager.startConversation();
