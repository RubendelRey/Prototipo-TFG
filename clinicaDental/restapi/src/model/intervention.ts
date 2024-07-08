import { BaseEntity } from "./baseEntity";

export class Intervention extends BaseEntity {
  private patientId: string;
  private doctorId: string;
  private date: Date;
  private code: string;
  private name: string;
  private teeth: string[];

  constructor(
    patientId: string,
    doctorId: string,
    date: Date,
    code: string,
    name: string,
    teeth: string[]
  ) {
    super();
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.date = date;
    this.code = code;
    this.name = name;
    this.teeth = teeth;
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

  public getDate(): Date {
    return this.date;
  }

  public setDate(date: Date): void {
    this.date = date;
  }

  public getCode(): string {
    return this.code;
  }

  public setCode(code: string): void {
    this.code = code;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getTeeth(): string[] {
    return this.teeth;
  }

  public setTeeth(teeth: string[]): void {
    this.teeth = teeth;
  }
}
