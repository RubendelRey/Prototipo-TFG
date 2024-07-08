import {
  SolidDataset,
  Thing,
  createSolidDataset,
  getFile,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
  overwriteFile,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import {
  getSessionFromStorage,
  Session,
} from "@inrupt/solid-client-authn-node";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";
import { SolidUser } from "../model/solidUser";
import { Assertions } from "../assertions/assertions";
import { Patient } from "../model/patient";
import { PatientService } from "./patientService";
import { Treatment } from "../model/treatment";
import { TreatmentService } from "./treatmentService";
import { EntityToRDF } from "./rdf/entityToRDF";
import { FHIR } from "./rdf/fhir";
import { RequestRepository } from "../repositories/requestRepository";
import { Request } from "../model/request";

import path from "path";
import fs from "fs";
import { RdfTriplet } from "../model/rdfTriplet";
import { QueryEngine } from "@comunica/query-sparql-solid";
import { SnomedCodesService } from "./snomedCodesService";
import { PermissionManager } from "./permissionManager";

export class SolidService {
  private patientService: PatientService;
  private treatmentService: TreatmentService;
  private requestRepository: RequestRepository;

  constructor(
    patientService: PatientService,
    treatmentService: TreatmentService,
    requestRepository: RequestRepository
  ) {
    this.patientService = patientService;
    this.treatmentService = treatmentService;
    this.requestRepository = requestRepository;
  }

  public async solidLogIn(podProvider: string, req: any, res: any) {
    let host = process.env.DOMAIN || "localhost";
    let restApiport = process.env.RESTAPI_PORT || "6444";

    let clientName = "hospital";
    let redirectUrl = `https://${host}:${restApiport}/api/login/success`;
    const session: Session = new Session();
    req.session.solidSessionId = session.info.sessionId;
    await session.login({
      oidcIssuer: podProvider,
      redirectUrl: redirectUrl,
      clientName: clientName,
      handleRedirect: (url: string) => {
        res.redirect(url);
      },
    });
  }

  public async successfulLogin(req: any, res: any): Promise<any> {
    let host = process.env.DOMAIN || "localhost";
    let restApiport = process.env.RESTAPI_PORT || "6444";
    let webappPort = process.env.WEBAPP_PORT || "6443";

    let sessionId = req.session.solidSessionId;

    let solidSession = await getSessionFromStorage(sessionId);

    await solidSession?.handleIncomingRedirect(
      `https://${host}:${restApiport}/api${req.url}`
    );

    res.redirect(`https://${host}:${webappPort}/solidLoginSuccessful`);
  }

  public async exportDataToPod(
    sessionId: string,
    userId: string,
    resource: string,
    shape: string
  ) {
    Assertions.exists(sessionId, "SessionId cannot be null or undefined.");
    Assertions.exists(userId, "UserId cannot be null or undefined.");

    let session = await getSessionFromStorage(sessionId);

    if (session == null) {
      throw new Error("Session could not be found.");
    }
    let webId = session.info.webId;

    if (webId == undefined) {
      throw new Error("WebId cannot be undefined.");
    }

    let pod = webId.split("profile")[0];

    let patient: Patient = await this.patientService.getPatientByUserId(userId);
    let filter = { patientId: patient.getId() };
    let treatments: Treatment[] = await this.treatmentService.getTreatments(
      filter
    );

    for (let treatment of treatments) {
      let thingBuilder = EntityToRDF.treatmentToRDF(treatment);
      for (let tooth of treatment.getPieces()) {
        let snomedTooth = await SnomedCodesService.getToothCode(tooth);
        let toothThingBuilder = EntityToRDF.pieceToRDF(snomedTooth);

        let coding = this.getCoding(snomedTooth).build();
        await this.writeData(sessionId, resource, coding, pod);

        toothThingBuilder.addIri(FHIR.coding, coding);
        let toothThing = toothThingBuilder.build();
        await this.writeData(sessionId, resource, toothThing, pod);

        thingBuilder.addIri(FHIR.bodySite, toothThing);
      }

      let codeThingBuilder = EntityToRDF.getCodeableConcept(
        treatment.getTreatmentName(),
        treatment.getTreatmentIdentifier()
      );

      let codeCodingThingBuilder = EntityToRDF.getCoding(
        "http://snomed.info/sct",
        await SnomedCodesService.getProcedureCode(
          treatment.getTreatmentIdentifier()
        ),
        treatment.getTreatmentName()
      ).build();
      await this.writeData(sessionId, resource, codeCodingThingBuilder, pod);

      codeThingBuilder.addIri(FHIR.coding, codeCodingThingBuilder);
      let codeThing = codeThingBuilder.build();
      await this.writeData(sessionId, resource, codeThing, pod);

      thingBuilder.addIri(FHIR.code, codeThing);
      let thing: Thing = thingBuilder.build();
      await this.writeData(sessionId, resource, thing, pod);

      await this.uploadShape(sessionId, shape);
    }
  }

  public async requestImportDataFromPod(
    sessionId: string,
    userId: string,
    resource: string,
    shape: string
  ) {
    Assertions.exists(sessionId, "SessionId cannot be null or undefined.");
    let session = await getSessionFromStorage(sessionId);
    let webId = session?.info.webId;

    if (session == null) {
      throw new Error("Session could not be found.");
    }

    if (webId == undefined) {
      throw new Error("WebId cannot be undefined.");
    }

    let patient: Patient = await this.patientService.getPatientByUserId(userId);

    let pod = webId.split("profile")[0];
    let resourcePath = pod + resource;
    let shapePath = pod + shape;

    let request: Request = new Request(
      patient.getId(),
      resourcePath,
      shapePath
    );
    await PermissionManager.giveReadPermission(sessionId, resourcePath);
    await PermissionManager.giveReadPermission(sessionId, shapePath);
    await this.requestRepository.createRequest(request);
  }

  public async getSolidUser(sessionId: string) {
    Assertions.exists(sessionId, "SessionId cannot be null or undefined.");
    let session = await getSessionFromStorage(sessionId);
    let webId = session?.info.webId;

    if (session == null) {
      throw new Error("Session could not be found.");
    }

    if (webId == undefined) {
      throw new Error("WebId cannot be undefined.");
    }
    let profile = await this.getProfile(sessionId);
    let name: string | null = getStringNoLocale(profile, FOAF.name);
    let photo: string | null = getUrl(profile, VCARD.hasPhoto);

    if (name == null) {
      throw new Error(
        "The name of the user whose web id is " + webId + ", is null"
      );
    }

    return new SolidUser(name, webId, photo);
  }

  public async getSolidHistory(sessionId: string, requestId: string) {
    let session = await getSessionFromStorage(sessionId);

    if (session == null) {
      throw new Error("Session could not be found.");
    }

    let webId = session.info.webId;

    if (webId == undefined) {
      throw new Error("WebId cannot be undefined.");
    }

    let request: Request = await this.requestRepository.getRequest({
      _id: requestId,
    });

    let shape = await this.fetchFile(sessionId, request.getShape());

    let engine = new QueryEngine();
    let query = `
      SELECT ?s ?p ?o
      WHERE {
        ?s ?p ?o
      }
    `;

    let result = await engine.queryBindings(query, {
      sources: [request.getResource()],
      fetch: session.fetch,
    });
    let array = await result.toArray();
    let data: RdfTriplet[] = array.map((triplet: any) => {
      return new RdfTriplet(
        triplet.get("s")?.value as string,
        triplet.get("p")?.value.toString() as string,
        triplet.get("o")?.value.toString() as string
      );
    });

    return { data: data, shape: shape };
  }

  public async getImportDataRequests() {
    return this.requestRepository.getRequests({ completed: false });
  }

  public async completeRequest(requestId: string) {
    let request = await this.requestRepository.getRequest({ _id: requestId });
    request.setCompleted(true);
    await this.requestRepository.updateRequest({ _id: requestId }, request);
  }

  private async getProfile(sessionId: string) {
    let session = await getSessionFromStorage(sessionId);

    if (session == null) {
      throw new Error("Session could not be found.");
    }

    let webId = session.info.webId;

    if (webId == undefined) {
      throw new Error("WebId cannot be undefined.");
    }

    let myDataset = await getSolidDataset(webId, { fetch: session.fetch });
    const profile: Thing = getThing(myDataset, webId) as Thing;
    return profile;
  }

  private async writeData(
    sessionId: string,
    resource: string,
    thing: Thing,
    webId: string
  ): Promise<boolean> {
    Assertions.exists(sessionId, "The user must be logged in.");
    Assertions.exists(webId, "A web id must be provided.");

    let session = await getSessionFromStorage(sessionId);

    if (session == null) {
      throw Error("The user must be logged in.");
    }

    let dataset = await this.fetchData(sessionId, resource, webId);

    dataset = setThing(dataset, thing);

    try {
      await saveSolidDatasetAt(webId + resource, dataset, {
        fetch: session.fetch,
      });
    } catch (e) {
      return false;
    }

    return true;
  }

  private async fetchData(
    sessionId: string,
    resource: string,
    webId: string
  ): Promise<SolidDataset> {
    Assertions.exists(sessionId, "The user must be logged in.");
    Assertions.exists(webId, "A web id must be provided.");

    let session = await getSessionFromStorage(sessionId);

    if (session == null) {
      throw new Error("The user must be logged in.");
    }

    let dataset = createSolidDataset();

    try {
      dataset = await getSolidDataset(webId + resource, {
        fetch: session.fetch,
      });
    } catch (e) {}

    return dataset;
  }

  private async fetchFile(
    sessionId: string,
    resource: string
  ): Promise<string> {
    let session = await getSessionFromStorage(sessionId);

    if (session == null) {
      throw new Error("Session could not be found.");
    }

    let webId = session.info.webId;

    if (webId == undefined) {
      throw new Error("WebId cannot be undefined.");
    }

    let file = await getFile(resource, { fetch: session.fetch });

    return await file.text();
  }

  private async uploadShape(sessionId: string, route: string) {
    let session = await getSessionFromStorage(sessionId);

    if (session == null) {
      throw new Error("Session could not be found.");
    }

    let webId = session.info.webId?.split("profile")[0];

    if (webId == undefined) {
      throw new Error("WebId cannot be undefined.");
    }

    let shapeRoute = webId + route;

    let shapePath = path.join(__dirname, "..", "resources", "shape.shex");
    try {
      let shapeFile = new Blob([fs.readFileSync(shapePath).toString()]);
      await overwriteFile(shapeRoute, shapeFile, {
        contentType: "text/shex",
        fetch: session.fetch,
      });
    } catch (e) {
      console.error(e);
    }
  }

  private getCoding(code: string) {
    return EntityToRDF.getCodingForPiece("http://snomed.info/sct", code);
  }
}
