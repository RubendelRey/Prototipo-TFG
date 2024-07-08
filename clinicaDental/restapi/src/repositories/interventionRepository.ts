import { InterventionNotFoundError } from "../exceptions/interventionNotFound";
import { Intervention } from "../model/intervention";
import { BaseRepository } from "./baseRepository";

export class InterventionRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "interventions");
  }

  async createIntervention(intervention: any): Promise<string> {
    await super.insertOne(intervention);
    return intervention.getId();
  }

  async getInterventions(filter: any): Promise<Intervention[]> {
    const result = await super.find(filter);

    let interventions: Intervention[] = [];
    result.forEach((element: any) => {
      let intervention: Intervention = new Intervention(
        element.patientId,
        element.doctorId,
        element.date,
        element.code,
        element.name,
        element.teeth
      );
      intervention.setId(element._id);
      interventions.push(intervention);
    });

    return interventions;
  }

  async getIntervention(filter: any): Promise<Intervention> {
    const result = await super.findOne(filter);
    if (result === null) {
      throw new InterventionNotFoundError();
    }

    let intervention: Intervention = new Intervention(
      result.patientId,
      result.doctorId,
      result.date,
      result.code,
      result.name,
      result.teeth
    );
    intervention.setId(result._id);
    return intervention;
  }
}
