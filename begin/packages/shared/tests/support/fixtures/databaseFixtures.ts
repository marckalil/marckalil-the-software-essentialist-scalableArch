import { PrismaClient } from "@prisma/client";

import { database } from "@dddforum/backend/src/shared/bootstrap";
import { CreateUserInput } from "@dddforum/shared/src/api/users";

export class DatabaseFixtures {
  private connection: PrismaClient;
  constructor() {
    this.connection = database.getConnection();
  }

  public async reset() {
    const deleteAllComments = this.connection.comment.deleteMany();
    const deleteAllVotes = this.connection.vote.deleteMany();
    const deleteAllPosts = this.connection.post.deleteMany();
    const deleteMembers = this.connection.member.deleteMany();
    const deleteAllUsers = this.connection.user.deleteMany();
    try {
      await this.connection.$transaction([
        deleteAllComments,
        deleteAllVotes,
        deleteAllPosts,
        deleteMembers,
        deleteAllUsers,
      ]);
    } catch (error) {
      console.error("Error resetting database:", error);
    } finally {
      await this.connection.$disconnect();
    }
  }

  public async setUpWithExistingUsers(existingUsers: CreateUserInput[]) {
    try {
      for (const user of existingUsers) {
        await this.connection.user.create({
          data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: "dummyPassword",
          },
        });
      }
    } catch (error) {
      console.error("Error setting up existing users:", error);
    } finally {
      await this.connection.$disconnect();
    }
  }
}
