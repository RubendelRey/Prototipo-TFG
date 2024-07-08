import { SolidUser } from "../model/solidUser";
import getApiEndpoint from "./apiEndpoint";
import { Request } from "../model/request";
import { RdfTriplet } from "../model/rdfTriplet";
import { getPatient } from "./patients";

export async function exportDataToPod(
  resource: string,
  shape: string
): Promise<string> {
  const apiEndPoint = getApiEndpoint();
  let encodedResource = encodeURIComponent(resource);
  let encodedShape = encodeURIComponent(shape);
  try {
    let response = await fetch(
      `${apiEndPoint}/exportDataToPod?resource=${encodedResource}&shape=${encodedShape}`,
      {
        credentials: "include",
        mode: "cors",
      }
    );
    if (response.status === 200) {
      return "Datos exportados correctamente";
    } else {
      return "Error exportando datos a Pod";
    }
  } catch (e) {
    return "Error exportando datos a Pod";
  }
}

export async function requestImportDataFromPod(resource: string, shape: string): Promise<string> {
  const apiEndPoint = getApiEndpoint();
  let encodedResource = encodeURIComponent(resource);
  let encodedShape = encodeURIComponent(shape);
  try{
    let response = await fetch(
    `${apiEndPoint}/requestImportDataFromPod?resource=${encodedResource}&shape=${encodedShape}`,
    {
      credentials: "include",
      mode: "cors",
    });
  if (response.status === 200) {
    return "Solicitud de importación de datos realizada correctamente";
  }
  return "Error realizando la solicitud de importación de datos";
  } catch (e) {
    return "Error realizando la solicitud de importación de datos";
  }
}

export async function getImportDataRequests(): Promise<Request[]> {
  const apiEndPoint = getApiEndpoint();
  try {
    let response = await fetch(`${apiEndPoint}/importDataRequests`, {
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 200) {
      let result = await response.json();

      let requests: Request[] = [];
      for (let element of result) {
        let patient = await getPatient(element.patient);
        let request = new Request(patient, element.resource, element.shape);
        request.setId(element._id);
        requests.push(request);
      }

      return requests;
    } else {
      throw new Error("Error getting import data requests");
    }
  } catch (error) {
    throw error;
  }
}

export async function completeRequest(requestId: string): Promise<boolean> {
  const apiEndPoint = getApiEndpoint();
  try {
    let response = await fetch(`${apiEndPoint}/completeRequest/${requestId}`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 200) {
      return true;
    } else {
      console.error(response.status);
      throw new Error("Error completing request");
    }
  } catch (error) {
    throw error;
  }
}

export async function getSolidHistory(requestId: string) {
  const apiEndPoint = getApiEndpoint();
  try {
    let response = await fetch(`${apiEndPoint}/solidHistory/${requestId}`, {
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 200) {
      let result = await response.json();

      let data = result.data;
      let shape = result.shape;

      let history: RdfTriplet[] = [];
      data.forEach((element: any) => {
        let triplet = new RdfTriplet(
          element.subject,
          element.predicate,
          element.object
        );
        history.push(triplet);
      });
      return { data: data, shape: shape };
    } else {
      throw new Error("Error getting history");
    }
  } catch (error) {
    throw error;
  }
}

export async function solidLogIn(podProvider: string) {
  const apiEndPoint = getApiEndpoint();
  let encodedPodProvider = encodeURIComponent(podProvider);
  window.location.href = `${apiEndPoint}/solidLogIn?podProvider=${encodedPodProvider}`;
}

export async function isSolidLoggedIn(): Promise<boolean> {
  const apiEndPoint = getApiEndpoint();
  return fetch(`${apiEndPoint}/isSolidLoggedIn`, {
    credentials: "include",
    mode: "cors",
  })
    .then((response) => {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      return false;
    });
}

export async function solidLogOut(): Promise<boolean> {
  const apiEndPoint = getApiEndpoint();
  fetch(`${apiEndPoint}/solidLogOut`, {
    credentials: "include",
    mode: "cors",
  })
    .then((response) => {
      if (response.status === 200) {
      } else {
        console.error("Error logging out from Pod");
      }
    })
    .catch((error) => {
      console.error("Error logging out from Pod");
    });
  return true;
}

export async function getSolidProfile(): Promise<SolidUser> {
  const apiEndPoint = getApiEndpoint();
  try {
    let response = await fetch(`${apiEndPoint}/solidProfile`, {
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 200) {
      let json = await response.json();
      return new SolidUser(json.username, json.webId, json.photo);
    } else {
      throw new Error("Error getting profile");
    }
  } catch (error) {
    throw error;
  }
}
