function mockFunction(functionName: string, args: any) {
  switch (functionName) {
    case "getTask":
      // Fabricated details for a task
      return `Task ID ${
        args.id || "123"
      }: Title: "Implement API", Status: "In Progress", Assigned to: "John Doe", Due Date: "2024-05-30"`;

    case "getTasks":
      // Fabricated list of tasks
      return (
        "1. Refactor Codebase - Due: 2024-04-30, Status: Pending\n" +
        "2. Update Documentation - Due: 2024-05-05, Status: Completed\n" +
        "3. Optimize Database - Due: 2024-05-15, Status: In Progress"
      );

    case "createTask":
      // Confirmation of a new task creation
      return `New task with ID ${
        args.id || "124"
      } created successfully. Title: "Design New UI", Due Date: "2024-06-01"`;

    case "updateTask":
      // Confirmation of updating a task
      return `Task with ID ${args.id} updated. New Status: "Completed", Updated At: "2024-04-27"`;

    case "deleteTask":
      // Confirmation of deleting a task
      return `Task with ID ${args.id} has been deleted successfully.`;

    case "getTasksForUser":
      // Fabricated tasks for a specific user
      return (
        `User ID ${args.user_id} is assigned the following tasks:\n` +
        "1. Create Home Page - Due: 2024-05-20\n" +
        "2. Meet with Sponsors - Due: 2024-05-25"
      );

    case "getTasksInSprint":
      // Fabricated tasks in a sprint with a specific status
      return (
        `Sprint ID ${args.sprint_id} tasks with status '${args.status}':\n` +
        "1. Sprint Planning - Status: Planned\n" +
        "2. Sprint Review - Status: Scheduled"
      );

    default:
      return `No response defined for function: ${functionName}`;
  }
}

module.exports = mockFunction;
