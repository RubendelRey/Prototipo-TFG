import { Doctor } from "../model/doctor";
import getApiEndpoint from "./apiEndpoint";

export async function getDoctor(): Promise<Doctor> {
  const apiEndPoint = getApiEndpoint();
  let response;

  try {
    response = await fetch(apiEndPoint + "/doctor", {
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 200) {
      let data = await response.json();
      let user = new Doctor(
        data.name,
        data.surname,
        data.phone,
        data.email,
        data.address,
        new Date(data.birthdate)
      );
      user.setId(data.id);
      return user;
    } else {
      throw new Error("Doctor not found");
    }
  } catch (error) {
    throw error;
  }
}
