import path from "path";
import fs from "fs";
import { parse } from "csv-parse";
import { UserRepository } from "../repositories/userRepository";
import { Application } from "express";
import { PatientRepository } from "../repositories/patientRepository";
import { DoctorRepository } from "../repositories/doctorRepository";
import { TreatmentTypeRepository } from "../repositories/treatmentTypeRepository";
import { TreatmentRepository } from "../repositories/treatmentRepository";
import { Meeting } from "../model/meeting";
import { MeetingRepository } from "../repositories/meetingRepository";
import { RequestRepository } from "../repositories/requestRepository";

export class DataInitializationService {
  private app: Application;
  private userRepository: UserRepository;
  private patientRepository: PatientRepository;
  private doctorRepository: DoctorRepository;
  private treatmentRepository: TreatmentRepository;
  private treatmentTypeRepository: TreatmentTypeRepository;
  private meetingRepository: MeetingRepository;
  private requestRepository: RequestRepository;

  constructor(
    app: Application,
    userRepository: UserRepository,
    patientRepository: PatientRepository,
    doctorRepository: DoctorRepository,
    treatmentRepository: TreatmentRepository,
    treatmentTypeRepository: TreatmentTypeRepository,
    meetingRepository: MeetingRepository,
    requestRepository: RequestRepository
  ) {
    this.app = app;
    this.userRepository = userRepository;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
    this.treatmentRepository = treatmentRepository;
    this.treatmentTypeRepository = treatmentTypeRepository;
    this.meetingRepository = meetingRepository;
    this.requestRepository = requestRepository;
  }

  public async initializeData() {
    await this.initializePatients();
    await this.initializeDoctors();
    await this.initializeUsers();
    await this.initializeTreatmentTypes();
    await this.clearRequests();
    await this.initializeMeetings();
    await this.initializeTreatments();
  }

  private async initializeUsers() {
    await this.clearUsers();
    await this.parse(
      ["username", "email", "password", "role"],
      "users.csv",
      (u: any) => {
        let password = this.app
          .get("crypto")
          .createHmac("sha256", this.app.get("password"))
          .update(u.password)
          .digest("hex");
        let user = {
          username: u.username,
          email: u.email,
          password: password,
          role: u.role,
        };
        this.userRepository.insertOne(user);
      }
    );
  }

  private async clearUsers() {
    await this.userRepository.deleteAll();
  }

  private async initializePatients() {
    await this.clearPatients();
    await this.parse(
      ["name", "surname", "phone", "email", "address", "birthdate"],
      "patients.csv",
      (p: any) => {
        let patient = {
          name: p.name,
          surname: p.surname,
          phone: p.phone,
          email: p.email,
          address: p.address,
          birthdate: this.parseDate(p.birthdate),
        };
        this.patientRepository.insertOne(patient);
      }
    );
  }

  private async clearPatients() {
    await this.patientRepository.deleteAll();
  }

  private async initializeDoctors() {
    await this.clearDoctors();
    await this.parse(
      ["name", "surname", "phone", "email", "address", "birthdate"],
      "doctors.csv",
      (d: any) => {
        let doctor = {
          name: d.name,
          surname: d.surname,
          phone: d.phone,
          email: d.email,
          address: d.address,
          birthdate: this.parseDate(d.birthdate),
        };
        this.doctorRepository.insertOne(doctor);
      }
    );
  }

  private async clearDoctors() {
    await this.doctorRepository.deleteAll();
  }

  private async initializeTreatmentTypes() {
    await this.clearTreatmentTypes();
    await this.parse(["code", "name"], "treatmentTypes.csv", (it: any) => {
      let treatmentType = {
        code: it.code,
        name: it.name,
      };
      this.treatmentTypeRepository.insertOne(treatmentType);
    });
  }

  private async clearTreatmentTypes() {
    await this.treatmentTypeRepository.deleteAll();
  }

  private async initializeTreatments() {
    await this.clearTreatments();
    let patient = await this.patientRepository.findOne({});
    let doctor = await this.doctorRepository.findOne({});
    await this.parse(
      ["code", "pieces", "name", "date", "status"],
      "treatments.csv",
      (i: any) => {
        let pieces = i.pieces.split(",");
        if (pieces[0] === "") {
          pieces = [];
        }
        let treatment = {
          patientId: patient._id,
          doctorId: doctor._id,
          treatmentIdentifier: i.code,
          treatmentName: i.name,
          date: this.parseDate(i.date),
          pieces: pieces,
          status: i.status,
        };
        this.treatmentRepository.insertOne(treatment);
      }
    );
  }

  private async clearTreatments() {
    await this.treatmentRepository.deleteAll();
  }

  private async initializeMeetings() {
    await this.clearMeetings();
    let patient = await this.patientRepository.findOne({});
    let doctor = await this.doctorRepository.findOne({});
    await this.parse(["date"], "meetings.csv", (a: any) => {
      let meeting = new Meeting(
        this.parseDate(a.date),
        patient._id,
        doctor._id
      );
      this.meetingRepository.insertOne(meeting);
    });
  }

  private async clearMeetings() {
    await this.meetingRepository.deleteAll();
  }

  private async parse(headers: string[], file: string, func: any) {
    let csvFilePath = path.resolve(__dirname, "..", "resources", file);
    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
    parse(
      fileContent,
      {
        delimiter: ";",
        columns: headers,
      },
      (error, result: any[]) => {
        if (error) {
          console.error(error);
        } else {
          result.forEach((element) => {
            func(element);
          });
        }
      }
    );
  }

  private async clearRequests() {
    await this.requestRepository.deleteAll();
  }

  private parseDate(date: string): Date {
    let dateObj = new Date();
    let dateParts = date.split("/");
    dateObj.setFullYear(
      parseInt(dateParts[2]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[0])
    );

    return dateObj;
  }
}
