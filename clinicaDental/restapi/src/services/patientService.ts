import { PatientNotFoundError } from "../exceptions/patientNotFoundError";
import { UserNotFoundError } from "../exceptions/userNotFoundError";
import { Patient } from "../model/patient";
import { PatientRepository } from "../repositories/patientRepository";
import { UserRepository } from "../repositories/userRepository";

export class PatientService {
  private patientRepository: PatientRepository;
  private userRepository: UserRepository;

  constructor(
    patientRepository: PatientRepository,
    userRepository: UserRepository
  ) {
    this.patientRepository = patientRepository;
    this.userRepository = userRepository;
  }

  public async createPatient(body: any) {
    let patient = new Patient(
      body.name,
      body.surname,
      body.phone,
      body.email,
      body.address,
      body.birthdate
    );
    return await this.patientRepository.createPatient(patient);
  }

  public async getPatient(id: any): Promise<Patient> {
    let filter = { _id: id };
    let result = await this.patientRepository.findOne(filter);
    if (result.length == 0) {
      throw new Error("Patient not found");
    }
    return result;
  }

  public async getPatients(filter: any): Promise<Patient[]> {
    return await this.patientRepository.getPatients(filter);
  }

  public async getPatientByUserId(userId: string) {
    let filter = { _id: userId };
    let user = await this.userRepository.findOne(filter);
    if (user === null) {
      throw new UserNotFoundError();
    }

    let patientFilter = { email: user.email };
    let result = await this.patientRepository.findOne(patientFilter);
    if (result === undefined) {
      throw new PatientNotFoundError();
    }
    let patient = new Patient(
      result.name,
      result.surname,
      result.phone,
      result.email,
      result.address,
      result.birthdate
    );
    patient.setId(result._id);

    return patient;
  }
}
