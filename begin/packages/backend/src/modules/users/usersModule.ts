import { Database } from "../../shared/database";
import { WebServer } from "../../shared/webServer";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { UsersController } from "./usersController";
import { userErrorHandler } from "./usersError";
import { UsersService } from "./usersService";

export class UsersModule {
  private readonly usersService: UsersService;
  private readonly usersController: UsersController;

  private constructor(
    private readonly dbConnection: Database,
    private readonly transactionalEmailAPI: TransactionalEmailAPI
  ) {
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController();
  }

  createUsersService(): UsersService {
    return new UsersService(this.dbConnection, this.transactionalEmailAPI);
  }

  createUsersController(): UsersController {
    return new UsersController(this.usersService, userErrorHandler);
  }

  public static build(
    dbConnection: Database,
    transactionalEmailAPI: TransactionalEmailAPI
  ): UsersModule {
    return new UsersModule(dbConnection, transactionalEmailAPI);
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }
}
