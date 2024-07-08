export class TreatmentTypeNotFoundError extends Error {
  constructor() {
    super("Treatment type not found");
    this.name = "TreatmentTypeNotFoundError";
  }
}
