import { Database } from "../../shared/database";
import { WebServer } from "../../shared/webServer";
import { PostsController } from "./postsController";
import { postsErrorHandler } from "./postsError";
import { PostsService } from "./postsService";

export class PostsModule {
  private readonly postsService: PostsService;
  private readonly postsController: PostsController;

  private constructor(private readonly dbConnection: Database) {
    this.postsService = this.createPostsService();
    this.postsController = this.createPostsController();
  }

  public static build(dbConnection: Database): PostsModule {
    return new PostsModule(dbConnection);
  }

  createPostsService(): PostsService {
    return new PostsService(this.dbConnection);
  }

  createPostsController(): PostsController {
    return new PostsController(this.postsService, postsErrorHandler);
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/posts", this.postsController.getRouter());
  }
}
