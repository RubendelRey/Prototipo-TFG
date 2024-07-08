import { Appointment } from "../model/appointment";
import getApiEndpoint from "./apiEndpoint";

export async function getAppointmentsFor(role: string): Promise<Appointment[]> {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(`${apiEndPoint}/appointments/${role}`, {
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 200) {
      let data = await response.json();
      let appointments: Appointment[] = [];
      data.forEach((element: any) => {
        let appointment = new Appointment(
          new Date(element.date),
          element.patient,
          element.doctor
        );
        appointment.setId(element.id);
        appointments.push(appointment);
      });
      return appointments;
    } else {
      throw new Error("Appointments not found");
    }
  } catch (error) {
    throw error;
  }
}
