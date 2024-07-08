import { InterventionService } from "../services/interventionService";
import { PatientService } from "../services/patientService";

module.exports = function (
  api: any,
  service: InterventionService,
  patientService: PatientService
) {
  api.get("/interventions", async (req: any, res: any) => {
    try {
      let patient = await patientService.getPatientByUserId(req.session.user);
      let filter = { patientId: patient.getId() };
      let interventions = await service.getInterventions(filter);
      res.status(200).json(interventions);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.get("/interventions/:id", async (req: any, res: any) => {
    try {
      const intervention = await service.getIntervention(req.params.id);
      res.status(200).json(intervention);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.post("/interventions", async (req: any, res: any) => {
    try {
      let intervention = req.body;
      let id: string = await service.createIntervention(intervention);
      res.status(201).json(id);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
