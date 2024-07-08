import { InterventionTypeService } from "../services/interventionTypeService";

module.exports = function (api: any, service: InterventionTypeService) {
  api.get("/interventionTypes", async (req: any, res: any) => {
    try {
      let interventionTypes = await service.getInterventionTypes({});
      res.status(200).json(interventionTypes);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
