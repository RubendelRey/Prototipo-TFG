import { PatientService } from "../services/patientService";
import { Patient } from "../model/patient";
import { UserNotFoundError } from "../exceptions/userNotFoundError";
import { PatientNotFoundError } from "../exceptions/patientNotFoundError";

module.exports = function (api: any, service: PatientService) {
  api.get("/patients", async (req: any, res: any) => {
    try {
      let filter = req.query.filter;
      let patients: Patient[] = await service.getPatients(filter);
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.get("/patients/:id", async (req: any, res: any) => {
    try {
      const patient = await service.getPatient(req.params.id);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.post("/patients", async (req: any, res: any) => {
    try {
      let patient = new Patient(
        req.body.name,
        req.body.surname,
        req.body.phone,
        req.body.email,
        req.body.address,
        req.body.birthdate
      );
      let id = await service.createPatient(patient);
      res.status(201).json(id);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.get("/patient", async (req: any, res: any) => {
    service
      .getPatientByUserId(req.session.user)
      .then((patient) => {
        res.status(200).json(patient);
      })
      .catch((error: UserNotFoundError) => {
        res.status(404).send(error);
      })
      .catch((error: PatientNotFoundError) => {
        res.status(404).send(error);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });
};
