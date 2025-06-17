import { NextFunction, Request, Response, Router } from "express";
import { ErrorHandler } from "../../shared/errors";
import { ClientErrorException } from "../../shared/exceptions";
import { prisma } from "../../database";

export class PostsController {
  private readonly router: Router;
  constructor(private readonly errorHandler: ErrorHandler) {
    this.router = Router();
    this.setupRoutes();
    this.setupErrorHandler(errorHandler);
  }

  private setupRoutes() {
    this.router.get("/", this.getAllPosts.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private setupErrorHandler(errorHandler: ErrorHandler) {
    this.router.use(errorHandler);
  }

  private async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { sort } = req.query;

      if (sort !== "recent") throw new ClientErrorException();

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
      next(error);
    }
  }
}
