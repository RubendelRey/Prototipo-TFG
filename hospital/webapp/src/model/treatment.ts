import { BaseEntity } from "./baseEntity";
import { TreatmentStatus } from "./treatmentStatus";

export class Treatment extends BaseEntity {
  private patientId: string;
  private doctorId: string;
  private date: Date;
  private treatmentIdentifier: string;
  private treatmentName: string;
  private pieces: string[];
  private status: TreatmentStatus;

  constructor(
    patientId: string,
    doctorId: string,
    date: Date,
    treatmentIdentifier: string,
    treatmentName: string,
    pieces: string[],
    status: TreatmentStatus
  ) {
    super();
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.date = date;
    this.treatmentIdentifier = treatmentIdentifier;
    this.treatmentName = treatmentName;
    this.pieces = pieces;
    this.status = status;
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

  public getTreatmentIdentifier(): string {
    return this.treatmentIdentifier;
  }

  public setTreatmentIdentifier(treatmentIdentifier: string): void {
    this.treatmentIdentifier = treatmentIdentifier;
  }

  public getTreatmentName(): string {
    return this.treatmentName;
  }

  public setTreatmentName(treatmentName: string): void {
    this.treatmentName = treatmentName;
  }

  public getPieces(): string[] {
    return this.pieces;
  }

  public setPieces(pieces: string[]): void {
    this.pieces = pieces;
  }

  public getStatus(): TreatmentStatus {
    return this.status;
  }

  public setStatus(status: TreatmentStatus): void {
    this.status = status;
  }
}
