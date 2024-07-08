import { TreatmentService } from "../services/treatmentService";
import { PatientService } from "../services/patientService";

module.exports = function (
  api: any,
  service: TreatmentService,
  patientService: PatientService
) {
  api.get("/treatments", async (req: any, res: any) => {
    try {
      let patient = await patientService.getPatientByUserId(req.session.user);
      let filter = { patientId: patient.getId() };
      let treatments = await service.getTreatments(filter);
      res.status(200).json(treatments);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.get("/treatments/:id", async (req: any, res: any) => {
    try {
      const treatment = await service.getTreatment(req.params.id);
      res.status(200).json(treatment);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.post("/treatments", async (req: any, res: any) => {
    try {
      let treatment = req.body;
      let id: string = await service.createTreatment(treatment);
      res.status(201).json(id);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
};
