import { Appointment } from "../model/appointment";
import { BaseRepository } from "./baseRepository";

export class AppointmentRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "appointments");
  }

  public async createAppointment(appointment: any): Promise<string> {
    await super.insertOne(appointment);
    return appointment.getId();
  }

  public async getAppointments(filter: any): Promise<Appointment[]> {
    const result = await super.find(filter);

    let appointments: Appointment[] = [];
    result.forEach((element: any) => {
      let appointment: Appointment = new Appointment(
        element.date,
        element.patient,
        element.doctor
      );
      appointments.push(appointment);
    });

    return appointments;
  }
}
