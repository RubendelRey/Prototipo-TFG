import { InterventionType } from "../model/interventionType";
import getApiEndpoint from "./apiEndpoint";

export default async function getInterventionTypes() {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(`${apiEndPoint}/interventionTypes`, {
      credentials: "include",
      mode: "cors",
    });
    let data = await response.json();
    let interventionTypes: InterventionType[] = [];

    data.forEach((element: any) => {
      let interventionType = new InterventionType(element.code, element.name);
      interventionType.setId(element.id);
      interventionTypes.push(interventionType);
    });

    return interventionTypes;
  } catch (error) {
    throw error;
  }
}
