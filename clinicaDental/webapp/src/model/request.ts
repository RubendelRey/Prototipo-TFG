import { BaseEntity } from "./baseEntity";
import { Patient } from "./patient";

export class Request extends BaseEntity {
  private patient: Patient;
  private resource: string;
  private shape: string;
  private completed: boolean;

  constructor(patient: Patient, resource: string, shape: string) {
    super();
    this.patient = patient;
    this.resource = resource;
    this.shape = shape;
    this.completed = false;
  }

  public getPatient(): Patient {
    return this.patient;
  }

  public setPatient(patient: Patient) {
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
