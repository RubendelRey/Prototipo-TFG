import { DoctorNotFoundError } from "../exceptions/doctorNotFound";
import { PatientNotFoundError } from "../exceptions/patientNotFoundError";
import { Meeting } from "../model/meeting";
import { MeetingService } from "../services/meetingService";
import { DoctorService } from "../services/doctorService";
import { PatientService } from "../services/patientService";

module.exports = function (
  api: any,
  meetingService: MeetingService,
  doctorService: DoctorService,
  patientService: PatientService
) {
  api.post("/meeting", async (req: any, res: any) => {
    meetingService
      .createMeeting(req.body)
      .then((meeting: any) => {
        res.status(201).json(meeting);
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

  api.get("/meetings/doctor", async (req: any, res: any) => {
    let doctor = await doctorService.getDoctorByUserId(req.session.user);
    meetingService
      .getDoctorMeetings(doctor.getId())
      .then((meetings: Meeting[]) => {
        res.status(200).json(meetings);
      })
      .catch((error: DoctorNotFoundError) => {
        res.status(404).json(error);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/meetings/patient", async (req: any, res: any) => {
    let patient = await patientService.getPatientByUserId(req.session.user);
    meetingService
      .getPatientMeetings(patient.getId())
      .then((meetings: Meeting[]) => {
        res.status(200).json(meetings);
      })
      .catch((error: PatientNotFoundError) => {
        res.status(404).json(error);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/meetings", async (req: any, res: any) => {
    meetingService
      .getMeetings()
      .then((meetings: Meeting[]) => {
        res.status(200).json(meetings);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });
};
