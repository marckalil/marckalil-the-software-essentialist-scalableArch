import { NextFunction, Request, Response, Router } from "express";

import { ClientErrorException } from "../../shared/exceptions";
import { ErrorHandler } from "../../shared/errors";
import { PostsService } from "./postsService";

export class PostsController {
  private readonly router: Router;
  constructor(
    private readonly postsService: PostsService,
    private readonly errorHandler: ErrorHandler
  ) {
    this.router = Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupRoutes() {
    this.router.get("/", this.getAllPosts.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { sort } = req.query;
      if (sort !== "recent") throw new ClientErrorException();

      const posts = await this.postsService.getAllPosts();
      return res.json({
        error: undefined,
        data: { posts },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
