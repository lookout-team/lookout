import readline from "readline";
import assistant from "./assistant";

const userId = 1;
assistant.startConversation(userId);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "User > ",
});

rl.prompt();

rl.on("line", async (input: string) => {
  const response = await assistant.processUserInput(userId, input);
  console.log("\n");
  console.log(`Assistant > ${response.message}`);
  console.log(`Data: ${JSON.stringify(response.data, null, 2)}`);
  console.log(`Component Type: ${response.componentType}`);
  console.log(`Status: ${response.status}`);
  console.log(`Type: ${response.type}`);
  console.log("\n");
  rl.prompt();
});
