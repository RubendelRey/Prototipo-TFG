import { TreatmentType } from "../model/treatmentType";
import { TreatmentTypeRepository } from "../repositories/treatmentTypeRepository";

export class TreatmentTypeService {
  private treatmentTypeRepository: TreatmentTypeRepository;

  constructor(treatmentTypeRepository: TreatmentTypeRepository) {
    this.treatmentTypeRepository = treatmentTypeRepository;
  }

  async getTreatmentTypes(filter: any): Promise<TreatmentType[]> {
    return this.treatmentTypeRepository.getTreatmentTypes(filter);
  }
}
