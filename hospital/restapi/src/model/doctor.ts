import { BaseEntity } from "./baseEntity";

export class Doctor extends BaseEntity {
  private name: string;
  private surname: string;
  private phone: string;
  private email: string;
  private address: string;
  private birthdate: Date;

  constructor(
    name: string,
    surname: string,
    phone: string,
    email: string,
    address: string,
    birthdate: Date
  ) {
    super();
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.birthdate = birthdate;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getSurname(): string {
    return this.surname;
  }

  public setSurname(surname: string): void {
    this.surname = surname;
  }

  public getPhone(): string {
    return this.phone;
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getAddress(): string {
    return this.address;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public getBirthdate(): Date {
    return this.birthdate;
  }

  public setBirthdate(birthdate: Date): void {
    this.birthdate = birthdate;
  }
}
