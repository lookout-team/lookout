import readline from "readline";
import { LookoutAssistant } from "./assistant";

const manager = new LookoutAssistant();
manager.startConversation();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "User > ",
});

rl.prompt();

rl.on("line", async (input: any) => {
  const response = await manager.processUserInput(input);
  console.log("\n");
  console.log(`Assistant > ${response.message}`);
  console.log(`Data: ${JSON.stringify(response.data, null, 2)}`);
  console.log(`Component Type: ${response.componentType}`);
  console.log(`Status: ${response.status}`);
  console.log("\n");
  rl.prompt();
});
