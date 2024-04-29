const { OpenAI } = require("openai");
require('dotenv').config();

class AssistantManager {
  openai: any;
  assistantId: any;
  threadId: any;
  thread: any;
  constructor() {
    this.openai = new OpenAI();
  }

  async createAssistant() {
    const assistant = await this.openai.beta.assistants.create({
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
  
        Always confirm user commands and clarify ambiguous requests to ensure accuracy in task management operations. For now, the actual functions are not setup well after they are called and may give bad info. Do your best to make this up for the user at this time.
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
  
    this.assistantId = assistant.id;
    console.log("Created Assistant with Id: " + this.assistantId);
    return assistant;
  }

  async createThread() {
    this.thread = await this.openai.beta.threads.create();
  
    this.threadId = this.thread.id;
    console.log("Created thread with Id: " + this.threadId);
  }

  async addMessageToThread(message: any) {
    const msg = await this.openai.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: message
    });
    console.log("Message added to thread: " + msg.id);
  }

  async createRun() {
    const run = await this.openai.beta.threads.runs.createAndPoll(this.thread.id, {
      assistant_id: this.assistantId,
      additional_instructions: "Please address the user by their name."
    });
    
    console.log("Run status: " + run.status);

    if (run.status === "completed") {
      // Fetch and print messagess after the run is completed
      const messages = await this.openai.beta.threads.messages.list(this.thread.id);
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
    } else if (run.status === "requires_action") {
      await this.handleRequiresAction(run, this.thread.id);
    } else {
      console.log("Run completed without needing additional actions.");
    }
  }

  async handleRequiresAction(run: { required_action: { submit_tool_outputs: { tool_calls: any[]; }; }; id: any; }, threadId: any) {
    console.log("Handling required action...");
    const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map(tool => {
      // Simulate function execution. Replace this with actual function calls and handle arguments appropriately.
      const output = this.simulateFunction(tool.function.name, tool.function.arguments);
      return {
        tool_call_id: tool.id,
        output: output,
      };
    });
  
    // Submit all tool outputs at once after collecting them in a list
    if (toolOutputs.length > 0) {
      run = await this.openai.beta.threads.runs.submitToolOutputsAndPoll(threadId, run.id, { tool_outputs: toolOutputs });
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
    }
  
    // Retrieve messages from the thread
    const messages = await this.openai.beta.threads.messages.list(threadId);
    // messages.getPaginatedItems().forEach((message: any) => {
    //   console.log(JSON.stringify(message, null, 2));
    // });
    for (const message of messages.data.reverse()) {
      console.log(`${message.role} > ${message.content[0].text.value}`);
    }
  }

  simulateFunction(functionName: string, args: any) {
    switch (functionName) {
      case "getTask":
        // Fabricated details for a task
        return `Task ID ${args.id || "123"}: Title: "Implement API", Status: "In Progress", Assigned to: "John Doe", Due Date: "2024-05-30"`;
  
      case "getTasks":
        // Fabricated list of tasks
        return "1. Refactor Codebase - Due: 2024-04-30, Status: Pending\n" +
               "2. Update Documentation - Due: 2024-05-05, Status: Completed\n" +
               "3. Optimize Database - Due: 2024-05-15, Status: In Progress";
  
      case "createTask":
        // Confirmation of a new task creation
        return `New task with ID ${args.id || "124"} created successfully. Title: "Design New UI", Due Date: "2024-06-01"`;
  
      case "updateTask":
        // Confirmation of updating a task
        return `Task with ID ${args.id} updated. New Status: "Completed", Updated At: "2024-04-27"`;
  
      case "deleteTask":
        // Confirmation of deleting a task
        return `Task with ID ${args.id} has been deleted successfully.`;
  
      case "getTasksForUser":
        // Fabricated tasks for a specific user
        return `User ID ${args.user_id} is assigned the following tasks:\n` +
               "1. Create Home Page - Due: 2024-05-20\n" +
               "2. Meet with Sponsors - Due: 2024-05-25";
  
      case "getTasksInSprint":
        // Fabricated tasks in a sprint with a specific status
        return `Sprint ID ${args.sprint_id} tasks with status '${args.status}':\n` +
               "1. Sprint Planning - Status: Planned\n" +
               "2. Sprint Review - Status: Scheduled";
  
      default:
        return `No response defined for function: ${functionName}`;
    }
  }

  async startConversation() {
    await this.createAssistant();
    await this.createThread();

    const readLine = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'User > '
    });

    readLine.prompt();
    readLine.on('line', async (input: any) => {
      await this.addMessageToThread(input);
      await this.createRun();
      readLine.prompt();
    });
  }
}


const manager = new AssistantManager();
manager.startConversation();