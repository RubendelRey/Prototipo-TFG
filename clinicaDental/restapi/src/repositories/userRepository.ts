import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "users");
  }

  public async login(username: string, password: string) {
    try {
      const userDB = await super.findOne({
        username: username,
        password: password,
      });
      return userDB;
    } catch (error) {
      throw error;
    }
  }
}
