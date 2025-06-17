import express from "express";
const cors = require("cors");

import { ContactListAPI } from "./modules/marketing/contactListApi";
import { Database } from "./database";
import { MarketingController } from "./modules/marketing";
import { marketingErrorHandler } from "./modules/marketing/marketingErrors";
import { MarketingService } from "./modules/marketing/marketingService";
import { PostsController } from "./modules/posts/postsController";
import { postsErrorHandler } from "./modules/posts/postsError";
import { PostsService } from "./modules/posts/postsService";
import { userErrorHandler } from "./modules/users/usersError";
import { UsersController } from "./modules/users/usersController";
import { UsersService } from "./modules/users/usersService";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(cors());

export const prisma = new PrismaClient();
const database = new Database(prisma);

// USERS
const usersService = new UsersService(database);
const usersController = new UsersController(usersService, userErrorHandler);
app.use("/users", usersController.getRouter());

// MARKETING
const contactListAPI = new ContactListAPI();
const marketingService = new MarketingService(contactListAPI);
const marketingController = new MarketingController(
  marketingService,
  marketingErrorHandler
);
app.use("/marketing", marketingController.getRouter());

// POSTS
const postsService = new PostsService(database);
const postsController = new PostsController(postsService, postsErrorHandler);
app.use("/posts", postsController.getRouter());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
