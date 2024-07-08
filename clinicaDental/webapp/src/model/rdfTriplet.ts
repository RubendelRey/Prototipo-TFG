export class RdfTriplet {
  private subject: string;
  private predicate: string;
  private object: string;

  constructor(subject: string, predicate: string, object: string) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
  }

  public getSubject(): string {
    return this.subject;
  }

  public getPredicate(): string {
    return this.predicate;
  }

  public getObject(): string {
    return this.object;
  }
}