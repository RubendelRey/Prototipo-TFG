export class InterventionNotFoundError extends Error {
  constructor() {
    super("Intervention not found");
    this.name = "InterventionNotFoundError";
  }
}
