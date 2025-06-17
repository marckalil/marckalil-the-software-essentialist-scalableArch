import express, { Request, Response } from "express";
import { Database, prisma } from "./database";
import { User } from "@prisma/client";
import { MarketingController } from "./modules/marketing";
import { MarketingService } from "./modules/marketing/marketingService";
import { ContactListAPI } from "./modules/marketing/contactListApi";
import { marketingErrorHandler } from "./modules/marketing/marketingErrors";
import { UsersController } from "./modules/users/usersController";
const cors = require("cors");

import { Errors } from "./shared/errors";
import { UsersService } from "./modules/users/usersService";
import { userErrorHandler } from "./modules/users/usersError";
import { PostsController } from "./modules/posts/postsController";
import { postsErrorHandler } from "./modules/posts/postsError";

const app = express();
app.use(express.json());
app.use(cors());

const database = new Database();

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
const postsController = new PostsController(postsErrorHandler);
app.use("/posts", postsController.getRouter());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

prisma.post
  .findMany({})
  .then((posts) => console.log(posts))
  .catch((err) => console.log(err));

export { app };
