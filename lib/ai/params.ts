export const ProjectParams = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "ID",
    },
    title: {
      type: "string",
      description: "Title",
    },
    description: {
      type: "string",
      description: "Description",
    },
    current_sprint_id: {
      type: "number",
      description: "Current sprint that this project is on",
    },
  },
};

export const SprintParams = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "ID",
    },
    title: {
      type: "string",
      description: "Title",
    },
    start_date: {
      type: "string",
      description: "Start date",
    },
    end_date: {
      type: "string",
      description: "End date",
    },
    planned_capacity: {
      type: "number",
      description: "Points planned for the sprint",
    },
    project_id: {
      type: "number",
      description: "ID of associated project",
    },
  },
};

export const TaskParams = {
  type: "object",
  properties: {
    id: {
      type: "number",
      description: "ID",
    },
    title: {
      type: "string",
      description: "Title",
    },
    description: {
      type: "string",
      description: "Description",
    },
    category: {
      type: "string",
      description: "Category",
    },
    requirements: {
      type: "string",
      description: "Requirements",
    },
    acceptance_criteria: {
      type: "string",
      description: "Acceptance criteria",
    },
    points: {
      type: "number",
      description: "Points",
    },
    assigned_to: {
      type: "number",
      description: "ID of assigned user",
    },
    sprint_id: {
      type: "number",
      description: "ID of associated sprint",
    },
    status_id: {
      type: "number",
      description: "Status ID",
    },
    priority_id: {
      type: "number",
      description: "Priority ID",
    },
  },
};
