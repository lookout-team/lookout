export const ProjectParams = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "The unique identifier of the project",
    },
    title: {
      type: "string",
      description: "The title of the project.",
    },
    description: {
      type: "string",
      description: "Detailed description of the project.",
    },
    last_updated: {
      type: "string",
      description: "Last updated date of the project.",
    },
    current_sprint_id: {
      type: "number",
      description: "Current sprint ID of the project.",
    },
  },
};
