import { DoctorNotFoundError } from "../exceptions/doctorNotFound";
import { InterventionNotFoundError } from "../exceptions/interventionNotFound";
import { InterventionTypeNotFoundError } from "../exceptions/interventionTypeNotFound";
import { PatientNotFoundError } from "../exceptions/patientNotFoundError";
import { Intervention } from "../model/intervention";
import { DoctorRepository } from "../repositories/doctorRepository";
import { InterventionRepository } from "../repositories/interventionRepository";
import { InterventionTypeRepository } from "../repositories/interventionTypeRepository";
import { PatientRepository } from "../repositories/patientRepository";

export class InterventionService {
  private interventionRepository: InterventionRepository;
  private patientRepository: PatientRepository;
  private doctorRepository: DoctorRepository;
  private interventionTypeRepository: InterventionTypeRepository;

  constructor(
    interventionRepository: InterventionRepository,
    patientRepository: PatientRepository,
    doctorRepository: DoctorRepository,
    interventionTypeRepository: InterventionTypeRepository
  ) {
    this.interventionRepository = interventionRepository;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
    this.interventionTypeRepository = interventionTypeRepository;
  }

  async getInterventions(filter: any): Promise<Intervention[]> {
    return await this.interventionRepository.getInterventions(filter);
  }

  async getIntervention(interventionId: number): Promise<Intervention> {
    const intervention = await this.interventionRepository.getIntervention(
      interventionId
    );
    if (!intervention) {
      throw new InterventionNotFoundError();
    }
    return intervention;
  }

  async createIntervention(body: any): Promise<string> {
    let filter = { _id: body.patientId };
    const patient = await this.patientRepository.findOne(filter);
    if (!patient) {
      throw new PatientNotFoundError();
    }
    let filter3 = { code: body.code };
    const interventionType = await this.interventionTypeRepository.findOne(
      filter3
    );
    if (!interventionType || interventionType.name !== body.name) {
      throw new InterventionTypeNotFoundError();
    }

    let intervention = new Intervention(
      body.patientId,
      body.doctorId,
      body.date,
      body.code,
      body.name,
      body.teeth || []
    );
    return this.interventionRepository.createIntervention(intervention);
  }
}
