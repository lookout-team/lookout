/**
 * Represents the type of a component.
 * It can be one of the following: "table", "card", or null.
 */
export type ComponentType = "table" | "card" | null;

/**
 * Represents the response from an assistant.
 */
export type AssistantResponse = {
  message: string;
  data: any;
  componentType: ComponentType;
  status: "pending" | "confirmed" | "canceled";
};
