import { PrismaClient } from "@prisma/client";

import { User } from "@dddforum/shared/src/api/users";
import { Post } from "@dddforum/shared/src/api/posts";

import { generateRandomPassword } from "./utils";
import { CreateUserDTO } from "../modules/users/createUserDTO";
interface UsersPersistence {
  save(userData: CreateUserDTO): Promise<User & { password: string }>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(email: string): Promise<User | null>;
}

interface PostsPersistence {
  findAllPosts(): Promise<Post[]>;
}

export class Database {
  public users: UsersPersistence;
  public posts: PostsPersistence;
  private connection: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.connection = prismaClient;
    this.users = this.buildUsersPersistence();
    this.posts = this.buildPostsPersistence();
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

  private buildPostsPersistence(): PostsPersistence {
    return {
      findAllPosts: this.findAllPosts.bind(this),
    };
  }

  // USERS
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

  //POSTS
  private formatPost(post: any): Post {
    return {
      id: post.id,
      memberId: post.memberId,
      postType: post.postType,
      title: post.title,
      content: post.content,
      dateCreated: post.dateCreated.toISOString(),
      memberPostedBy: {
        user: {
          id: post.member.id,
          email: post.member.user.email,
          username: post.member.user.username,
          firstName: post.member.user.firstName,
          lastName: post.member.user.lastName,
        },
      },
      votes: post.votes,
      comments: post.comments,
    };
  }

  private async findAllPosts(): Promise<Post[]> {
    const postsWithVotes = await this.connection.post.findMany({
      include: {
        votes: true, // Include associated votes for each post
        memberPostedBy: {
          include: {
            user: true,
          },
        },
        comments: true,
      },
      orderBy: {
        dateCreated: "desc", // Sorts by dateCreated in descending order
      },
    });
    const posts = postsWithVotes.map((post) => this.formatPost(post));
    return posts;
  }
}
