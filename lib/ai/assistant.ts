const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI; // API key is automatically read from OPENAI_API_KEY env variable

async function main() {
  const assistant = await openai.beta.assistants.create({
    model: "gpt-3.5-turbo",
    name: "Lookout Assistant",
    instructions:
      "You are a chat assistant for an AI powered task management web application. You will perform CRUD operations through function calling based on user input. You do not currently have access to the database, so make it up for now.",
    // tools = [],
  });

  let assistantId = assistant.id;
  console.log("Created Assistant with Id: " + assistantId);

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content:
          '"What tasks are currently open in project Lookout?"',
      },
    ],
  });

  let threadId = thread.id;
  console.log("Created thread with Id: " + threadId);

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId,
    additional_instructions:
      "Please address the user as Joel.",
  });

  console.log("Run finished with status: " + run.status);

  if (run.status == "completed") {
    const messages = await openai.beta.threads.messages.list(thread.id);
    for (const message of messages.getPaginatedItems()) {
      console.log(JSON.stringify(message, null, 2));
    }
  }
}

main();
