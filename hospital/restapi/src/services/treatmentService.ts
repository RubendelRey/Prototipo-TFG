import { TreatmentNotFoundError } from "../exceptions/treatmentNotFound";
import { TreatmentTypeNotFoundError } from "../exceptions/treatmentTypeNotFound";
import { PatientNotFoundError } from "../exceptions/patientNotFoundError";
import { Treatment } from "../model/treatment";
import { TreatmentStatus } from "../model/treatmentStatus";
import { DoctorRepository } from "../repositories/doctorRepository";
import { TreatmentRepository } from "../repositories/treatmentRepository";
import { TreatmentTypeRepository } from "../repositories/treatmentTypeRepository";
import { PatientRepository } from "../repositories/patientRepository";

export class TreatmentService {
  private treatmentRepository: TreatmentRepository;
  private patientRepository: PatientRepository;
  private doctorRepository: DoctorRepository;
  private treatmentTypeRepository: TreatmentTypeRepository;

  constructor(
    treatmentRepository: TreatmentRepository,
    patientRepository: PatientRepository,
    doctorRepository: DoctorRepository,
    treatmentTypeRepository: TreatmentTypeRepository
  ) {
    this.treatmentRepository = treatmentRepository;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
    this.treatmentTypeRepository = treatmentTypeRepository;
  }

  async getTreatments(filter: any): Promise<Treatment[]> {
    return await this.treatmentRepository.getTreatments(filter);
  }

  async getTreatment(treatmentId: number): Promise<Treatment> {
    const treatment = await this.treatmentRepository.getTreatment(treatmentId);
    if (!treatment) {
      throw new TreatmentNotFoundError();
    }
    return treatment;
  }

  async createTreatment(body: any): Promise<string> {
    let filter = { _id: body.patientId };
    const patient = await this.patientRepository.findOne(filter);
    if (!patient) {
      throw new PatientNotFoundError();
    }

    let filter3 = { code: body.treatmentIdentifier };
    const treatmentType = await this.treatmentTypeRepository.findOne(filter3);
    if (!treatmentType || treatmentType.name !== body.treatmentName) {
      throw new TreatmentTypeNotFoundError();
    }

    let treatment = new Treatment(
      body.patientId,
      body.doctorId,
      body.date,
      body.treatmentIdentifier,
      body.treatmentName,
      body.pieces || [],
      (<any>TreatmentStatus)[body.status] || TreatmentStatus.Completed
    );
    return this.treatmentRepository.createTreatment(treatment);
  }
}
