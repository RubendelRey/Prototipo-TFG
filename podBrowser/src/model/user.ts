export class User {
  private username: string;
  private webId: string;
  private photo: string | null;
  private organization: string | null;
  private role: string | null;
  private address: string | null;
  private email: string | null;
  private phone: string | null;
  private birthDate: Date | null;
  private notes: string | null;

  public constructor(
    username: string,
    webId: string,
    photo: string | null,
    organization: string | null,
    role: string | null,
    address: string | null,
    email: string | null,
    phone: string | null,
    birthDate: Date | null,
    notes: string | null
  ) {
    this.username = username;
    this.webId = webId.split("profile")[0];
    this.photo = photo;
    this.organization = organization;
    this.role = role;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.birthDate = birthDate;
    this.notes = notes;
  }
  public getUsername(): string {
    return this.username;
  }

  public getWebId(): string {
    return this.webId;
  }

  public getPhoto(): string | null {
    return this.photo;
  }

  public getOrganization(): string | null {
    return this.organization;
  }

  public getRole(): string | null {
    return this.role;
  }

  public getAddress(): string | null {
    return this.address;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public getPhone(): string | null {
    return this.phone;
  }

  public getBirthDate(): Date | null {
    return this.birthDate;
  }

  public getNotes(): string | null {
    return this.notes;
  }
}
