import OpenAI from "openai";
const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "Task Management Assistant",
    instructions: "You are an assistant for a task management web application.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-3.5-turbo",
  });
}

main();
