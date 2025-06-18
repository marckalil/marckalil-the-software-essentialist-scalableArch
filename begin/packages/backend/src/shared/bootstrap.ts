import { PrismaClient } from "@prisma/client";
import { Database } from "./database";

import { Server } from "./server";

import { ContactListAPI } from "../modules/marketing/contactListApi";
import { MarketingController } from "../modules/marketing";
import { marketingErrorHandler } from "../modules/marketing/marketingErrors";
import { MarketingService } from "../modules/marketing/marketingService";

import { PostsController } from "../modules/posts/postsController";
import { postsErrorHandler } from "../modules/posts/postsError";
import { PostsService } from "../modules/posts/postsService";

import { TransactionalEmailAPI } from "../modules/notifications/transactionalEmailAPI";

import { userErrorHandler } from "../modules/users/usersError";
import { UsersController } from "../modules/users/usersController";
import { UsersService } from "../modules/users/usersService";

// DATABASE
export const prisma = new PrismaClient();
const database = new Database(prisma);

// USERS
const transactionalEmailAPI = new TransactionalEmailAPI();
const usersService = new UsersService(database, transactionalEmailAPI);
const usersController = new UsersController(usersService, userErrorHandler);

// MARKETING
const contactListAPI = new ContactListAPI();
const marketingService = new MarketingService(contactListAPI);
const marketingController = new MarketingController(
  marketingService,
  marketingErrorHandler
);

// POSTS
const postsService = new PostsService(database);
const postsController = new PostsController(postsService, postsErrorHandler);

// SERVER
export const server = new Server(
  usersController,
  marketingController,
  postsController
);
