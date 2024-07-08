import { DoctorNotFoundError } from "../exceptions/doctorNotFound";
import { PatientNotFoundError } from "../exceptions/patientNotFoundError";
import { Appointment } from "../model/appointment";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { DoctorRepository } from "../repositories/doctorRepository";
import { PatientRepository } from "../repositories/patientRepository";

export class AppointmentService {
  private appointmentRepository: AppointmentRepository;
  private doctorRepository: DoctorRepository;
  private patientRepository: PatientRepository;

  constructor(
    appointmentRepository: AppointmentRepository,
    doctorRepository: DoctorRepository,
    patientRepository: PatientRepository
  ) {
    this.appointmentRepository = appointmentRepository;
    this.doctorRepository = doctorRepository;
    this.patientRepository = patientRepository;
  }

  public async createAppointment(appointment: any): Promise<string> {
    const doctor = await this.doctorRepository.findOne({
      _id: appointment.doctor,
    });
    if (!doctor) {
      throw new DoctorNotFoundError();
    }
    const patient = await this.patientRepository.findOne({
      _id: appointment.patient,
    });
    if (!patient) {
      throw new PatientNotFoundError();
    }
    return await this.appointmentRepository.createAppointment(appointment);
  }

  public async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    const result = await this.appointmentRepository.find({
      doctorId: doctorId,
      date: { $gte: new Date() },
    });
    const appointments = result.map((appointment: any) => {
      return new Appointment(
        appointment.date,
        appointment.patient,
        appointment.doctor
      );
    });
    return appointments;
  }

  public async getPatientAppointments(
    patientId: string
  ): Promise<Appointment[]> {
    const result = await this.appointmentRepository.find({
      patientId: patientId,
      date: { $gte: new Date() },
    });
    const appointments = result.map((appointment: any) => {
      return new Appointment(
        appointment.date,
        appointment.patient,
        appointment.doctor
      );
    });
    return appointments;
  }

  public async getAppointments(): Promise<Appointment[]> {
    const result = await this.appointmentRepository.find({});
    const appointments = result.map((appointment: any) => {
      return new Appointment(
        appointment.date,
        appointment.patient,
        appointment.doctor
      );
    });
    return appointments;
  }
}
