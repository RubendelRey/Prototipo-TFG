import { QueryEngine } from "@comunica/query-sparql-solid";
import {
  SolidDataset,
  getSolidDataset,
  isContainer,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { RdfTriplet } from "../model/rdfTriplet";

export async function isResourceFile(
  session: Session,
  resource: string
): Promise<boolean> {
  if (session == null) {
    throw new Error("The user must be logged in.");
  }

  let webId = session.info.webId?.split("profile")[0];

  if (webId == null) {
    throw new Error("The user must be logged in.");
  }

  let url = webId + resource;

  try {
    await getSolidDataset(url, {
      fetch: session.fetch,
    });
    return false;
  } catch (e: any) {
    return e.message.includes("406");
  }
}

export async function isResourceContainer(
  session: Session,
  resource: string
): Promise<boolean> {
  if (session == null) {
    throw new Error("The user must be logged in.");
  }

  let webId = session.info.webId?.split("profile")[0];

  if (webId == null) {
    throw new Error("The user must be logged in.");
  }

  let url = webId + resource;

  try {
    return isContainer(
      await getSolidDataset(url, {
        fetch: session.fetch,
      })
    );
  } catch (e) {
    console.error("ERROR");
    return false;
  }
}

export async function fetchData(
  session: Session,
  resource: string
): Promise<SolidDataset> {
  if (session == null) {
    throw new Error("The user must be logged in.");
  }

  let webId = session.info.webId?.split("profile")[0];

  if (webId == null) {
    throw new Error("The user must be logged in.");
  }

  let dataset;
  let url = webId + resource;

  try {
    dataset = await getSolidDataset(url, {
      fetch: session.fetch,
    });
  } catch (e) {
    throw e;
  }
  return dataset;
}

export async function fetchContainer(
  session: Session,
  resource: string
): Promise<RdfTriplet[]> {
  if (session == null) {
    throw new Error("The user must be logged in.");
  }
  let webId = session.info.webId?.split("profile")[0];
  let url = webId + resource;
  let engine = new QueryEngine();
  let query = `
      SELECT ?s ?p ?o
      WHERE {
        ?s ?p ?o
      }
    `;

  let result = await engine.queryBindings(query, {
    sources: [url],
    fetch: session.fetch,
  });
  let array = await result.toArray();
  return array.map((triplet) => {
    return new RdfTriplet(
      triplet.get("s")?.value as string,
      triplet.get("p")?.value.toString() as string,
      triplet.get("o")?.value.toString() as string
    );
  });
}
