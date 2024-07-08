export class FHIR {
  private static fhir: string = "http://hl7.org/fhir/";

  public static id: string = this.fhir + "id";

  public static identifier: string = this.fhir + "identifier";
  public static text: string = this.fhir + "text";
  public static status = this.fhir + "status";
  public static bodySite = this.fhir + "bodySite";
  public static occurrenceDateTime = this.fhir + "occurrenceDateTime";

  public static coding = this.fhir + "coding";

  public static system = this.fhir + "system";
  public static code = this.fhir + "code";
  public static display = this.fhir + "display";
}
