import {
  Thing,
  ThingBuilder,
  buildThing,
  createThing,
} from "@inrupt/solid-client";
import { Treatment } from "../../model/treatment";
import { FHIR } from "./fhir";
import { FDIPiecesService } from "../fdiPiecesService";

export class EntityToRDF {
  public static treatmentToRDF(treatment: Treatment): ThingBuilder<Thing> {
    let thingBuilder: ThingBuilder<Thing> = buildThing(
      createThing({ name: "procedure-" + treatment.getId() })
    )
      .addStringNoLocale(FHIR.id, treatment.getId())
      .addStringNoLocale(FHIR.code, treatment.getTreatmentIdentifier())
      .addDatetime(FHIR.occurrenceDateTime, treatment.getDate())
      .addStringNoLocale(FHIR.status, "completed");

    return thingBuilder;
  }

  public static pieceToRDF(piece: string): ThingBuilder<Thing> {
    let pieceName: string = FDIPiecesService.getFDIPiecesName(piece);

    return this.getCodeableConcept(pieceName, piece);
  }

  public static getCodeableConcept(
    text: string,
    code: string
  ): ThingBuilder<Thing> {
    return buildThing(
      createThing({ name: "codeableConcept-" + code })
    ).addStringNoLocale(FHIR.text, text);
  }

  public static getCoding(system: string, code: string, display: string) {
    return buildThing(createThing({ name: "coding-" + code }))
      .addStringNoLocale(FHIR.system, system)
      .addStringNoLocale(FHIR.code, code)
      .addStringNoLocale(FHIR.display, display);
  }

  public static getCodingForPiece(
    system: string,
    code: string
  ): ThingBuilder<Thing> {
    let display: string = FDIPiecesService.getFDIPiecesName(code);
    return buildThing(createThing({ name: "coding-" + code }))
      .addStringNoLocale(FHIR.system, system)
      .addStringNoLocale(FHIR.code, code)
      .addStringNoLocale(FHIR.display, display);
  }
}
