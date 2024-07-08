import { DoctorNotFoundError } from "../exceptions/doctorNotFound";
import { PatientNotFoundError } from "../exceptions/patientNotFoundError";
import { Meeting } from "../model/meeting";
import { MeetingRepository } from "../repositories/meetingRepository";
import { DoctorRepository } from "../repositories/doctorRepository";
import { PatientRepository } from "../repositories/patientRepository";

export class MeetingService {
  private meetingRepository: MeetingRepository;
  private doctorRepository: DoctorRepository;
  private patientRepository: PatientRepository;

  constructor(
    meetingRepository: MeetingRepository,
    doctorRepository: DoctorRepository,
    patientRepository: PatientRepository
  ) {
    this.meetingRepository = meetingRepository;
    this.doctorRepository = doctorRepository;
    this.patientRepository = patientRepository;
  }

  public async createMeeting(meeting: any): Promise<string> {
    const doctor = await this.doctorRepository.findOne({
      _id: meeting.doctor,
    });
    if (!doctor) {
      throw new DoctorNotFoundError();
    }
    const patient = await this.patientRepository.findOne({
      _id: meeting.patient,
    });
    if (!patient) {
      throw new PatientNotFoundError();
    }
    return await this.meetingRepository.createMeeting(meeting);
  }

  public async getDoctorMeetings(doctorId: string): Promise<Meeting[]> {
    const result = await this.meetingRepository.find({
      doctorId: doctorId,
      date: { $gte: new Date() },
    });
    const meetings = result.map((meeting: any) => {
      return new Meeting(
        meeting.date,
        meeting.patient,
        meeting.doctor
      );
    });
    return meetings;
  }

  public async getPatientMeetings(
    patientId: string
  ): Promise<Meeting[]> {
    const result = await this.meetingRepository.find({
      patientId: patientId,
      date: { $gte: new Date() },
    });
    const meetings = result.map((meeting: any) => {
      return new Meeting(
        meeting.date,
        meeting.patient,
        meeting.doctor
      );
    });
    return meetings;
  }

  public async getMeetings(): Promise<Meeting[]> {
    const result = await this.meetingRepository.find({});
    const meetings = result.map((meeting: any) => {
      return new Meeting(
        meeting.date,
        meeting.patient,
        meeting.doctor
      );
    });
    return meetings;
  }
}
