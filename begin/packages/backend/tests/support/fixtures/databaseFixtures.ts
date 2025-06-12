import { prisma } from "../../../src/database";

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

export const databaseFixtures = {
  reset,
};
