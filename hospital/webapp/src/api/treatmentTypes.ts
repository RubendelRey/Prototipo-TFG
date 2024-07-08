import { TreatmentType } from "../model/treatmentType";
import getApiEndpoint from "./apiEndpoint";

export default async function getTreatmentTypes() {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(`${apiEndPoint}/treatmentTypes`, {
      credentials: "include",
      mode: "cors",
    });
    let data = await response.json();
    let treatmentTypes: TreatmentType[] = [];

    data.forEach((element: any) => {
      let treatmentType = new TreatmentType(element.code, element.name);
      treatmentType.setId(element.id);
      treatmentTypes.push(treatmentType);
    });

    return treatmentTypes;
  } catch (error) {
    throw error;
  }
}
