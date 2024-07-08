import { TreatmentType } from "../model/treatmentType";
import { BaseRepository } from "./baseRepository";

export class TreatmentTypeRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "treatmentTypes");
  }

  public async getTreatmentTypes(filter: any): Promise<TreatmentType[]> {
    const result = await super.find(filter);
    let treatmentTypes: TreatmentType[] = [];

    result.forEach((element: any) => {
      let treatmentType: TreatmentType = new TreatmentType(
        element.code,
        element.name
      );
      treatmentTypes.push(treatmentType);
    });

    return treatmentTypes;
  }

  public async getTreatmentType(code: string): Promise<TreatmentType> {
    let filter = { code: code };
    const result = await super.findOne(filter);
    let treatmentType: TreatmentType = new TreatmentType(
      result.code,
      result.name
    );

    return treatmentType;
  }
}
