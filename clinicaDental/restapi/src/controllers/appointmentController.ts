import { DoctorNotFoundError } from "../exceptions/doctorNotFound";
import { PatientNotFoundError } from "../exceptions/patientNotFoundError";
import { Appointment } from "../model/appointment";
import { AppointmentService } from "../services/appointmentService";
import { DoctorService } from "../services/doctorService";
import { PatientService } from "../services/patientService";

module.exports = function (
  api: any,
  appointmentService: AppointmentService,
  doctorService: DoctorService,
  patientService: PatientService
) {
  api.post("/appointment", async (req: any, res: any) => {
    appointmentService
      .createAppointment(req.body)
      .then((appointment: any) => {
        res.status(201).json(appointment);
      })
      .catch((error: DoctorNotFoundError) => {
        res.status(404).json(error);
      })
      .catch((error: PatientNotFoundError) => {
        res.status(404).json(error);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/appointments/doctor", async (req: any, res: any) => {
    let doctor = await doctorService.getDoctorByUserId(req.session.user);
    appointmentService
      .getDoctorAppointments(doctor.getId())
      .then((appointments: Appointment[]) => {
        res.status(200).json(appointments);
      })
      .catch((error: DoctorNotFoundError) => {
        res.status(404).json(error);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/appointments/patient", async (req: any, res: any) => {
    let patient = await patientService.getPatientByUserId(req.session.user);
    appointmentService
      .getPatientAppointments(patient.getId())
      .then((appointments: Appointment[]) => {
        res.status(200).json(appointments);
      })
      .catch((error: PatientNotFoundError) => {
        res.status(404).json(error);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/appointments", async (req: any, res: any) => {
    appointmentService
      .getAppointments()
      .then((appointments: Appointment[]) => {
        res.status(200).json(appointments);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });
};
