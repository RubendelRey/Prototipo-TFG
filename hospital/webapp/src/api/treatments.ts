import { Treatment } from "../model/treatment";
import getApiEndpoint from "./apiEndpoint";

export async function getTreatments(): Promise<Treatment[]> {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(`${apiEndPoint}/treatments`, {
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 200) {
      let data = await response.json();
      let treatments: Treatment[] = [];
      data.forEach((element: any) => {
        let treatment = new Treatment(
          element.patient,
          element.doctor,
          new Date(element.date),
          element.treatmentIdentifier,
          element.treatmentName,
          element.pieces,
          element.status
        );
        treatment.setId(element.id);
        treatments.push(treatment);
      });
      return treatments;
    } else {
      throw new Error("Meetings not found");
    }
  } catch (error) {
    throw error;
  }
}

export async function postTreatment(treatment: Treatment): Promise<boolean> {
  const apiEndPoint = getApiEndpoint();
  try {
    let response = await fetch(`${apiEndPoint}/treatments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(treatment),
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
