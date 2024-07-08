import { Patient } from "../model/patient";
import { BaseRepository } from "./baseRepository";

export class PatientRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "patients");
  }

  async createPatient(patient: Patient): Promise<string> {
    await super.insertOne(patient);
    return patient.getId();
  }

  async getPatients(filter: any): Promise<Patient[]> {
    const result = await super.find(filter);

    let patients: Patient[] = [];
    result.forEach((element: any) => {
      let patient = new Patient(
        element.name,
        element.surname,
        element.phone,
        element.email,
        element.address,
        element.birthdate
      );
      patient.setId(element._id);
      patients.push(patient);
    });

    return patients;
  }
}
