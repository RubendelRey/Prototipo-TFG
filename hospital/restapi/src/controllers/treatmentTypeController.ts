import { TreatmentTypeService } from "../services/treatmentTypeService";

module.exports = function (api: any, service: TreatmentTypeService) {
  api.get("/treatmentTypes", async (req: any, res: any) => {
    try {
      let treatmentTypes = await service.getTreatmentTypes({});
      res.status(200).json(treatmentTypes);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
