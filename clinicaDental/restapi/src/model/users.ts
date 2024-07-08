import { BaseEntity } from "./baseEntity";

export class User extends BaseEntity {
  private username: string;
  private email: string;
  private role: string;

  constructor(username: string, email: string, role: string) {
    super();
    this.username = username;
    this.email = email;
    this.role = role;
  }

  public getUsername(): string {
    return this.username;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getRole(): string {
    return this.role;
  }

  public setRole(role: string): void {
    this.role = role;
  }
}
