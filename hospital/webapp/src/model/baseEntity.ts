import { v4 as uuid } from "uuid";

export abstract class BaseEntity {
  private _id: string;

  constructor() {
    this._id = uuid();
  }

  getId(): string {
    return this._id;
  }
  setId(id: string): void {
    this._id = id;
  }
}
