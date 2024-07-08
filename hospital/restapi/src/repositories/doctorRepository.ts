import { DoctorNotFoundError } from "../exceptions/doctorNotFound";
import { Doctor } from "../model/doctor";
import { BaseRepository } from "./baseRepository";

export class DoctorRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "doctors");
  }

  public async createDoctor(doctor: any): Promise<string> {
    await super.insertOne(doctor);
    return doctor.getId();
  }

  public async getDoctors(filter: any) {
    const result = await super.find(filter);

    let doctors: Doctor[] = [];
    result.forEach((element: any) => {
      let doctor: Doctor = new Doctor(
        element.name,
        element.surname,
        element.phone,
        element.email,
        element.address,
        element.birthdate
      );
      doctor.setId(element._id);
      doctors.push(doctor);
    });

    return doctors;
  }
}
