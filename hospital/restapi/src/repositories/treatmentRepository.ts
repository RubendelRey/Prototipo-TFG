import { TreatmentNotFoundError } from "../exceptions/treatmentNotFound";
import { Treatment } from "../model/treatment";
import { BaseRepository } from "./baseRepository";

export class TreatmentRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "treatments");
  }

  async createTreatment(treatment: any): Promise<string> {
    await super.insertOne(treatment);
    return treatment.getId();
  }

  async getTreatments(filter: any): Promise<Treatment[]> {
    const result = await super.find(filter);

    let treatments: Treatment[] = [];
    result.forEach((element: any) => {
      let treatment: Treatment = new Treatment(
        element.patientId,
        element.doctorId,
        element.date,
        element.treatmentIdentifier,
        element.treatmentName,
        element.pieces,
        element.status
      );
      treatment.setId(element._id);
      treatments.push(treatment);
    });

    return treatments;
  }

  async getTreatment(filter: any): Promise<Treatment> {
    const result = await super.findOne(filter);
    if (result === null) {
      throw new TreatmentNotFoundError();
    }

    let treatment: Treatment = new Treatment(
      result.patientId,
      result.doctorId,
      result.date,
      result.code,
      result.name,
      result.teeth,
      result.status
    );
    treatment.setId(result._id);
    return treatment;
  }
}
