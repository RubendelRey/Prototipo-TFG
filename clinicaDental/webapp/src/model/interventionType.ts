import { BaseEntity } from "./baseEntity";

export class InterventionType extends BaseEntity {
  private code: string;
  private name: string;

  constructor(code: string, name: string) {
    super();
    this.code = code;
    this.name = name;
  }

  public getCode(): string {
    return this.code;
  }

  public setCode(code: string): void {
    this.code = code;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }
}
