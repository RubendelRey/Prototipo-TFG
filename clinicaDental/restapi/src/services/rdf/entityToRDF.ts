import {
  Thing,
  ThingBuilder,
  buildThing,
  createThing,
} from "@inrupt/solid-client";
import { Intervention } from "../../model/intervention";
import { FHIR } from "./fhir";
import { FDITeethService } from "../fdiTeethService";

export class EntityToRDF {
  public static interventionToRDF(
    intervention: Intervention
  ): ThingBuilder<Thing> {
    let thingBuilder: ThingBuilder<Thing> = buildThing(
      createThing({ name: "procedure-" + intervention.getId() })
    )
      .addStringNoLocale(FHIR.id, intervention.getId())
      .addStringNoLocale(FHIR.code, intervention.getCode())
      .addDatetime(FHIR.occurrenceDateTime, intervention.getDate());

    return thingBuilder;
  }

  public static toothToRDF(tooth: string): ThingBuilder<Thing> {
    let toothName: string = FDITeethService.getFDITeethName(tooth);

    return this.getCodeableConcept(toothName, tooth);
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

  public static getCodingForTooth(
    system: string,
    code: string
  ): ThingBuilder<Thing> {
    let display: string = FDITeethService.getFDITeethName(code);
    return buildThing(createThing({ name: "coding-" + code }))
      .addStringNoLocale(FHIR.system, system)
      .addStringNoLocale(FHIR.code, code)
      .addStringNoLocale(FHIR.display, display);
  }
}
