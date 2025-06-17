import { Database } from "../../database";
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
} from "../../shared/exceptions";
import { CreateUserDTO } from "./createUserDTO";

export class UsersService {
  constructor(private readonly db: Database) {}
  public async createUser(userData: CreateUserDTO) {
    const existingUserByEmail = await this.db.users.findUserByEmail(
      userData.email
    );
    if (existingUserByEmail) throw new EmailAlreadyInUseException();

    const existingUserByUsername = await this.db.users.findUserByUsername(
      userData.username
    );
    if (existingUserByUsername) throw new UsernameAlreadyTakenException();

    const response = await this.db.users.save(userData);
    return response;
  }

  public async getUserByEmail(email: string) {
    const user = await this.db.users.findUserByEmail(email);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
