import path from "path";
import fs from "fs";
import { parse } from "csv-parse";
import { UserRepository } from "../repositories/userRepository";
import { Application } from "express";
import { PatientRepository } from "../repositories/patientRepository";
import { DoctorRepository } from "../repositories/doctorRepository";
import { InterventionTypeRepository } from "../repositories/interventionTypeRepository";
import { InterventionRepository } from "../repositories/interventionRepository";
import { Appointment } from "../model/appointment";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { RequestRepository } from "../repositories/requestRepository";

export class DataInitializationService {
  private app: Application;
  private userRepository: UserRepository;
  private patientRepository: PatientRepository;
  private doctorRepository: DoctorRepository;
  private interventionRepository: InterventionRepository;
  private interventionTypeRepository: InterventionTypeRepository;
  private appointmentRepository: AppointmentRepository;
  private requestRepository: RequestRepository;

  constructor(
    app: Application,
    userRepository: UserRepository,
    patientRepository: PatientRepository,
    doctorRepository: DoctorRepository,
    interventionRepository: InterventionRepository,
    interventionTypeRepository: InterventionTypeRepository,
    appointmentRepository: AppointmentRepository,
    requestRepository: RequestRepository
  ) {
    this.app = app;
    this.userRepository = userRepository;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
    this.interventionRepository = interventionRepository;
    this.interventionTypeRepository = interventionTypeRepository;
    this.appointmentRepository = appointmentRepository;
    this.requestRepository = requestRepository;
  }

  public async initializeData() {
    await this.initializePatients();
    await this.initializeDoctors();
    await this.initializeUsers();
    await this.initializeInterventionTypes();
    await this.clearRequests();
    await this.initializeAppointments();
    await this.initializeInterventions();
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

  private async initializeInterventionTypes() {
    await this.clearInterventionTypes();
    await this.parse(["code", "name"], "interventionTypes.csv", (it: any) => {
      let interventionType = {
        code: it.code,
        name: it.name,
      };
      this.interventionTypeRepository.insertOne(interventionType);
    });
  }

  private async clearInterventionTypes() {
    await this.interventionTypeRepository.deleteAll();
  }

  private async initializeInterventions() {
    await this.clearInterventions();
    let patient = await this.patientRepository.findOne({});
    let doctor = await this.doctorRepository.findOne({});
    await this.parse(
      ["code", "teeth", "name", "date"],
      "interventions.csv",
      (i: any) => {
        let teeth = i.teeth.split(",");
        if (teeth[0] === "") {
          teeth = [];
        }
        let intervention = {
          patientId: patient?._id,
          doctorId: doctor?._id,
          code: i.code,
          name: i.name,
          date: this.parseDate(i.date),
          teeth: teeth,
          status: i.status,
        };
        this.interventionRepository.insertOne(intervention);
      }
    );
  }

  private async clearInterventions() {
    await this.interventionRepository.deleteAll();
  }

  private async initializeAppointments() {
    await this.clearAppointments();
    let patient = await this.patientRepository.findOne({});
    let doctor = await this.doctorRepository.findOne({});
    await this.parse(["date"], "appointments.csv", (a: any) => {
      let appointment = new Appointment(
        this.parseDate(a.date),
        patient?._id,
        doctor?._id
      );
      this.appointmentRepository.insertOne(appointment);
    });
  }

  private async clearAppointments() {
    await this.appointmentRepository.deleteAll();
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
