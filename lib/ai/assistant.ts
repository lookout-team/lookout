const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI; // API key is automatically read from OPENAI_API_KEY env variable

async function main() {
  const assistant = await openai.beta.assistants.create({
    model: "gpt-3.5-turbo",
    name: "Lookout Assistant",
    instructions: `
      You are an AI-powered chat assistant designed to manage tasks within a web application. Here are guidelines on how to use the available functions:

      - Use "getTask" when asked for details about a specific task by its ID or by specific parameters like due date or priority.
      - Use "getTasks" to fetch multiple tasks based on general search parameters such as status, category, or due dates.
      - Use "createTask" when the user wants to add a new task, ensuring you capture all necessary details like title, description, and due date.
      - Use "updateTask" when a user requests changes to an existing task. Ensure changes are clearly specified by the user.
      - Use "deleteTask" when a user confirms the deletion of a specific task.
      - Use "getTasksForUser" to retrieve all tasks assigned to a specific user, especially when reviewing a user's workload or task list.
      - Use "getTasksInSprint" for queries related to tasks within a specific sprint, particularly when discussing sprint planning or sprint reviews.

      Always confirm user commands and clarify ambiguous requests to ensure accuracy in task management operations.
    `,
    tools: [
      {
        type: "function",
        function: {
          name: "getTask",
          description: "Retrieve a specific task by ID or parameters",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "The ID of the task to retrieve."
              },
              params: {
                type: "string",
                description: "Parameters to query tasks."
              }
            },
            required: ["id"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getTasks",
          description: "Retrieve tasks based on given parameters",
          parameters: {
            type: "object",
            properties: {
              params: {
                type: "string",
                description: "Parameters to search for multiple tasks."
              }
            },
            required: ["params"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "createTask",
          description: "Create a new task",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "ID for the new task."
              }
            },
            required: ["id"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "updateTask",
          description: "Update an existing task",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "The ID of the task to update."
              }
            },
            required: ["id"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "deleteTask",
          description: "Delete an existing task",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "The ID of the task to delete."
              }
            },
            required: ["id"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getTasksForUser",
          description: "Retrieve all tasks assigned to a specific user",
          parameters: {
            type: "object",
            properties: {
              user_id: {
                type: "number",
                description: "The user ID to retrieve tasks for."
              }
            },
            required: ["user_id"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getTasksInSprint",
          description: "Retrieve all tasks in a specific sprint with a given status",
          parameters: {
            type: "object",
            properties: {
              sprint_id: {
                type: "number",
                description: "The sprint ID to retrieve tasks from."
              },
              status: {
                type: "string",
                description: "The status of the tasks to retrieve."
              }
            },
            required: ["sprint_id", "status"]
          }
        }
      }
    ]
  });

  let assistantId = assistant.id;
  console.log("Created Assistant with Id: " + assistantId);

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content:
          '"What tasks are currently open?"',
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
