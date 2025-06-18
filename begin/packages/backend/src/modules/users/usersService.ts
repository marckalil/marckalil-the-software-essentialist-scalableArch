import { Database } from "../../shared/database";
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
} from "../../shared/exceptions";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { CreateUserDTO } from "./createUserDTO";

export class UsersService {
  constructor(
    private readonly db: Database,
    private readonly emailApi: TransactionalEmailAPI
  ) {}

  public async createUser(userData: CreateUserDTO) {
    const existingUserByEmail = await this.db.users.findUserByEmail(
      userData.email
    );
    if (existingUserByEmail) throw new EmailAlreadyInUseException();

    const existingUserByUsername = await this.db.users.findUserByUsername(
      userData.username
    );
    if (existingUserByUsername) throw new UsernameAlreadyTakenException();

    const user = await this.db.users.save(userData);
    this.emailApi.sendMail({
      to: user.email,
      subject: "Your login details to DDDForum",
      text: `Welcome to DDDForum. You can login with the following details:\n
      email: ${user.email}\n
      password: ${user.password}`,
    });
    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.db.users.findUserByEmail(email);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
