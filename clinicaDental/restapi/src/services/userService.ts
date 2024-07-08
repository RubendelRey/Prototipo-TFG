import { UserNotFoundError } from "../exceptions/userNotFoundError";
import { User } from "../model/users";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async login(username: string, password: string): Promise<string> {
    try {
      const result = await this.userRepository.findOne({
        username: username,
        password: password,
      });

      if (result == null) {
        throw new UserNotFoundError();
      }
      return result._id.toString();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getUsers() {
    try {
      let filter = {};
      const result = await this.userRepository.find(filter);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getUser(id: string): Promise<User> {
    try {
      let filter = { _id: id };
      const result = await this.userRepository.findOne(filter);

      if (result == null) {
        throw new UserNotFoundError();
      }
      let user = new User(result.username, result.email, result.role);
      user.setId(result._id);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
