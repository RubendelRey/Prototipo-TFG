import { Intervention } from "../model/intervention";
import getApiEndpoint from "./apiEndpoint";

export async function getInterventions(): Promise<Intervention[]> {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(`${apiEndPoint}/interventions`, {
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 200) {
      let data = await response.json();
      let interventions: Intervention[] = [];
      data.forEach((element: any) => {
        let intervention = new Intervention(
          element.patient,
          element.doctor,
          new Date(element.date),
          element.code,
          element.name,
          element.teeth
        );
        intervention.setId(element.id);
        interventions.push(intervention);
      });
      return interventions;
    } else {
      throw new Error("Appointments not found");
    }
  } catch (error) {
    throw error;
  }
}

export async function postIntervention(intervention: Intervention): Promise<boolean>{
  const apiEndPoint = getApiEndpoint();
  try {
    let response = await fetch(`${apiEndPoint}/interventions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(intervention),
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}