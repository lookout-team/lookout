function mockFunction(functionName: string, args: any) {
  switch (functionName) {
    case "getTask":
      // Fabricated details for a task
      return {
        id: args.id || "123",
        title: "Implement API",
        status: "In Progress",
        assigned_to: "John Doe",
        due_date: "2024-05-30",
      };

    case "getTasks":
      // Fabricated list of tasks
      return [
        {
          id: 1,
          title: "Refactor Codebase",
          due_date: "2024-04-30",
          status: "Pending",
        },
        {
          id: 2,
          title: "Update Documentation",
          due_date: "2024-05-05",
          status: "Completed",
        },
        {
          id: 3,
          title: "Optimize Database",
          due_date: "2024-05-15",
          status: "In Progress",
        },
      ];

    case "createTask":
      // Confirmation of a new task creation
      return {
        id: args.id || "124",
        title: "Design New UI",
        due_date: "2024-06-01",
        status: "Created",
      };

    case "updateTask":
      // Confirmation of updating a task
      return {
        id: args.id,
        status: "Completed",
        updated_at: "2024-04-27",
      };

    case "deleteTask":
      // Confirmation of deleting a task
      return {
        id: args.id,
        status: "Deleted",
      };

    case "getTasksForUser":
      // Fabricated tasks for a specific user
      return [
        { id: 1, title: "Create Home Page", due_date: "2024-05-20" },
        { id: 2, title: "Meet with Sponsors", due_date: "2024-05-25" },
      ];

    case "getTasksInSprint":
      // Fabricated tasks in a sprint with a specific status
      return [
        { id: 1, title: "Sprint Planning", status: "Planned" },
        { id: 2, title: "Sprint Review", status: "Scheduled" },
      ];

    default:
      return `No response defined for function: ${functionName}`;
  }
}

module.exports = mockFunction;
