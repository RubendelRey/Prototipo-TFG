import { BaseEntity } from "./baseEntity";

export class Meeting extends BaseEntity {
  private date: Date;
  private patientId: string;
  private doctorId: string;

  constructor(date: Date, patientId: string, doctorId: string) {
    super();
    this.date = date;
    this.patientId = patientId;
    this.doctorId = doctorId;
  }

  public getDate(): Date {
    return this.date;
  }

  public setDate(date: Date): void {
    this.date = date;
  }

  public getPatientId(): string {
    return this.patientId;
  }

  public setPatientId(patientId: string): void {
    this.patientId = patientId;
  }

  public getDoctorId(): string {
    return this.doctorId;
  }

  public setDoctorId(doctorId: string): void {
    this.doctorId = doctorId;
  }
}
