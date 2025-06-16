import express, { Request, Response } from "express";
import { prisma } from "./database";
import { User } from "@prisma/client";
import { MarketingController } from "./modules/marketing";
import { MarketingService } from "./modules/marketing/marketingService";
import { ContactListAPI } from "./modules/marketing/contactListApi";
import { marketingErrorHandler } from "./modules/marketing/marketingErrors";
import { UsersController } from "./modules/users/usersController";
const cors = require("cors");

import { Errors } from "./shared/errors";

const app = express();
app.use(express.json());
app.use(cors());

// Get posts
app.get("/posts", async (req: Request, res: Response) => {
  try {
    const { sort } = req.query;

    if (sort !== "recent") {
      return res
        .status(400)
        .json({ error: Errors.ClientError, data: undefined, success: false });
    }

    let postsWithVotes = await prisma.post.findMany({
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

    return res.json({
      error: undefined,
      data: { posts: postsWithVotes },
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
});
const port = process.env.PORT || 3000;

const contactListAPI = new ContactListAPI();
const marketingService = new MarketingService(contactListAPI);
const marketingController = new MarketingController(
  marketingService,
  marketingErrorHandler
);

const usersController = new UsersController();

app.use("/users", usersController.getRouter());
app.use("/marketing", marketingController.getRouter());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

prisma.post
  .findMany({})
  .then((posts) => console.log(posts))
  .catch((err) => console.log(err));

export { app };
