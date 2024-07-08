export class TreatmentNotFoundError extends Error {
  constructor() {
    super("Treatment not found");
    this.name = "TreatmentNotFoundError";
  }
}
