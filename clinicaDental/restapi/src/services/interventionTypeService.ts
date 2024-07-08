import { InterventionType } from "../model/interventionType";
import { InterventionTypeRepository } from "../repositories/interventionTypeRepository";

export class InterventionTypeService {
  private interventionTypeRepository: InterventionTypeRepository;

  constructor(interventionTypeRepository: InterventionTypeRepository) {
    this.interventionTypeRepository = interventionTypeRepository;
  }

  async getInterventionTypes(filter: any): Promise<InterventionType[]> {
    return this.interventionTypeRepository.getInterventionTypes(filter);
  }
}
