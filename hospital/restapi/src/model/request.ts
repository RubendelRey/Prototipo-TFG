import { BaseEntity } from "./baseEntity";

export class Request extends BaseEntity {
  private patient: string;
  private resource: string;
  private shape: string;
  private completed: boolean;

  constructor(patient: string, resource: string, shape: string) {
    super();
    this.patient = patient;
    this.resource = resource;
    this.shape = shape;
    this.completed = false;
  }

  public getPatient(): string {
    return this.patient;
  }

  public setPatient(patient: string) {
    this.patient = patient;
  }

  public getResource(): string {
    return this.resource;
  }

  public setResource(resource: string) {
    this.resource = resource;
  }

  public getShape(): string {
    return this.shape;
  }

  public setShape(shape: string) {
    this.shape = shape;
  }

  public isCompleted(): boolean {
    return this.completed;
  }

  public setCompleted(completed: boolean) {
    this.completed = completed;
  }
}
