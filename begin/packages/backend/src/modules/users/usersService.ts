import { prisma } from "../../database";
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
} from "../../shared/exceptions";
import { generateRandomPassword } from "../../shared/utils";
import { CreateUserDTO } from "./createUserDTO";

export class UsersService {
  public async createUser(userData: CreateUserDTO) {
    const existingUserByEmail = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    if (existingUserByEmail) throw new EmailAlreadyInUseException();

    const existingUserByUsername = await prisma.user.findFirst({
      where: { username: userData.username },
    });
    if (existingUserByUsername) throw new UsernameAlreadyTakenException();

    const response = await prisma.$transaction(async (tx) => {
      const user = await prisma.user.create({
        data: { ...userData, password: generateRandomPassword(10) },
      });
      const member = await prisma.member.create({
        data: { userId: user.id },
      });
      return { user, member };
    });
    return response;
  }

  public async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
