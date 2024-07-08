import { Patient } from "../model/patient";
import getApiEndpoint from "./apiEndpoint";

export async function getPatient(patientId?: string): Promise<Patient> {
  const apiEndPoint = getApiEndpoint();
  const url = patientId
    ? `${apiEndPoint}/patients/${patientId}`
    : `${apiEndPoint}/patient`;
  let response;
  try {
    response = await fetch(url, {
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 200) {
      let data = await response.json();
      let patient = new Patient(
        data.name,
        data.surname,
        data.phone,
        data.email,
        data.address,
        new Date(data.birthdate)
      );
      patient.setId(data._id);
      return patient;
    } else {
      throw new Error("Patient not found");
    }
  } catch (error) {
    throw error;
  }
}
