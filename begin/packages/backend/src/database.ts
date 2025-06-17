import { User } from "@dddforum/shared/src/api/users";
import { PrismaClient } from "@prisma/client";
import { CreateUserDTO } from "./modules/users/createUserDTO";
import { generateRandomPassword } from "./shared/utils";

const prisma = new PrismaClient();

export { prisma };

interface UsersPersistence {
  save(userData: CreateUserDTO): Promise<User & { password: string }>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(email: string): Promise<User | null>;
}

export class Database {
  public users: UsersPersistence;
  private connection: PrismaClient;

  constructor() {
    this.connection = new PrismaClient();
    this.users = this.buildUsersPersistence();
  }

  getConnection() {
    return this.connection;
  }

  async connect() {
    await this.connection.$connect();
  }

  private buildUsersPersistence(): UsersPersistence {
    return {
      save: this.saveUser.bind(this),
      findUserByEmail: this.findUserByEmail.bind(this),
      findUserByUsername: this.findUserByUsername.bind(this),
    };
  }

  private async saveUser(userData: CreateUserDTO) {
    return await this.connection.$transaction(async () => {
      const user = await this.connection.user.create({
        data: { ...userData, password: generateRandomPassword(10) },
      });
      const member = await this.connection.member.create({
        data: { userId: user.id },
      });
      return user;
    });
  }

  private async findUserByEmail(email: string) {
    return await this.connection.user.findFirst({
      where: { email: email },
    });
  }

  private async findUserByUsername(username: string) {
    return await this.connection.user.findFirst({
      where: { username },
    });
  }
}
