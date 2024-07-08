import { DoctorNotFoundError } from "../exceptions/doctorNotFound";
import { UserNotFoundError } from "../exceptions/userNotFoundError";
import { Doctor } from "../model/doctor";
import { DoctorRepository } from "../repositories/doctorRepository";
import { UserRepository } from "../repositories/userRepository";

export class DoctorService {
  private doctorRepository: DoctorRepository;
  private userRepository: UserRepository;

  constructor(
    doctorRepository: DoctorRepository,
    userRepository: UserRepository
  ) {
    this.doctorRepository = doctorRepository;
    this.userRepository = userRepository;
  }

  async createDoctor(body: any): Promise<string> {
    let doctor = new Doctor(
      body.name,
      body.surname,
      body.phone,
      body.email,
      body.address,
      body.birthdate
    );
    return await this.doctorRepository.createDoctor(doctor);
  }

  async getDoctor(id: any): Promise<Doctor> {
    let filter = { id: id };
    let result = await this.doctorRepository.findOne(filter);
    if (result.length == 0) {
      throw new Error("Doctor not found");
    }
    return result[0];
  }

  async getDoctors(filter: any): Promise<Doctor[]> {
    return await this.doctorRepository.getDoctors(filter);
  }

  async getDoctorByUserId(userId: string) {
    let filter = { _id: userId };
    let user = await this.userRepository.findOne(filter);
    if (user === null) {
      throw new UserNotFoundError();
    }

    let doctorFilter = { email: user.email };
    let result = await this.doctorRepository.findOne(doctorFilter);
    if (result === undefined) {
      throw new DoctorNotFoundError();
    }
    let doctor = new Doctor(
      result.name,
      result.surname,
      result.phone,
      result.email,
      result.address,
      result.birthdate
    );
    doctor.setId(result._id);

    return doctor;
  }
}
