export class InterventionTypeNotFoundError extends Error {
  constructor() {
    super("Intervention type not found");
    this.name = "InterventionTypeNotFoundError";
  }
}
