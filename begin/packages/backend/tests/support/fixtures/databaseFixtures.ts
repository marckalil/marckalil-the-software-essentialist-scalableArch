import { CreateUserInput } from "@dddforum/shared/src/api/users";

import { prisma } from "../../../src";

async function reset() {
  const deleteAllComments = prisma.comment.deleteMany();
  const deleteAllVotes = prisma.vote.deleteMany();
  const deleteAllPosts = prisma.post.deleteMany();
  const deleteMembers = prisma.member.deleteMany();
  const deleteAllUsers = prisma.user.deleteMany();
  try {
    await prisma.$transaction([
      deleteAllComments,
      deleteAllVotes,
      deleteAllPosts,
      deleteMembers,
      deleteAllUsers,
    ]);
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function setUpWithExistingUsers(existingUsers: CreateUserInput[]) {
  try {
    for (const user of existingUsers) {
      await prisma.user.create({
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
    await prisma.$disconnect();
  }
}
export const databaseFixtures = {
  reset,
  setUpWithExistingUsers,
};
