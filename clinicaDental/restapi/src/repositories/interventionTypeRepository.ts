import { InterventionType } from "../model/interventionType";
import { BaseRepository } from "./baseRepository";

export class InterventionTypeRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "interventionTypes");
  }

  public async getInterventionTypes(filter: any): Promise<InterventionType[]> {
    const result = await super.find(filter);
    let interventionTypes: InterventionType[] = [];

    result.forEach((element: any) => {
      let interventionType: InterventionType = new InterventionType(
        element.code,
        element.name
      );
      interventionTypes.push(interventionType);
    });

    return interventionTypes;
  }

  public async getInterventionType(code: string): Promise<InterventionType> {
    let filter = { code: code };
    const result = await super.findOne(filter);
    let interventionType: InterventionType = new InterventionType(
      result.code,
      result.name
    );

    return interventionType;
  }
}
