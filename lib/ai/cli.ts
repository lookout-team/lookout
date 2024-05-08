import readline from "readline";
import { AssistantManager } from "./assistant";

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
  console.log("Status: " + response.status);
  rl.prompt();
});
