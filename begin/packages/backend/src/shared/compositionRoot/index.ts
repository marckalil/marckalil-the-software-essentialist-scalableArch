import { CompositionRootConfig } from "../config/compositionRootConfig";
import { Database } from "../database";
import { WebServer } from "../webServer";

import { TransactionalEmailAPI } from "../../modules/notifications/transactionalEmailAPI";
import { userErrorHandler } from "../../modules/users/usersError";
import { UsersController } from "../../modules/users/usersController";
import { UsersService } from "../../modules/users/usersService";

import { MarketingModule } from "../../modules/marketing/marketingModule";
import { PostsModule } from "../../modules/posts";

export class CompositionRoot {
  private static instance: CompositionRoot;
  private config: CompositionRootConfig;
  private databaseConnection: Database;
  private transactionalEmailAPI: TransactionalEmailAPI;
  private usersService: UsersService;
  private marketingModule: MarketingModule;
  private postsModule: PostsModule;
  private webServer: WebServer;

  public static createCompositionRoot(
    config: CompositionRootConfig
  ): CompositionRoot {
    if (!CompositionRoot.instance)
      CompositionRoot.instance = new CompositionRoot(config);
    return CompositionRoot.instance;
  }

  private constructor(config: CompositionRootConfig) {
    this.config = config;
    this.databaseConnection = this.createDatabaseConnection();
    this.transactionalEmailAPI = this.createTransactionalEmailAPI();
    this.usersService = this.createUsersService();
    this.marketingModule = this.createMarketingModule();
    this.postsModule = this.createPostsModule();
    this.webServer = this.createWebServer();
    this.mountRoutes();
  }

  // DATABASE CONNECTION
  private createDatabaseConnection(): Database {
    return new Database();
  }

  public getDatabaseConnection(): Database {
    if (!this.databaseConnection) {
      this.databaseConnection = this.createDatabaseConnection();
    }
    return this.databaseConnection;
  }

  // MODULES
  private createMarketingModule(): MarketingModule {
    return MarketingModule.build();
  }
  private createPostsModule(): PostsModule {
    return PostsModule.build(this.getDatabaseConnection());
  }

  // TRANSACTIONAL EMAIL API
  private createTransactionalEmailAPI(): TransactionalEmailAPI {
    return new TransactionalEmailAPI();
  }
  public getTransactionalEmailAPI(): TransactionalEmailAPI {
    if (!this.transactionalEmailAPI)
      this.transactionalEmailAPI = this.createTransactionalEmailAPI();
    return this.transactionalEmailAPI;
  }

  // USERS SERVICE
  private createUsersService(): UsersService {
    return new UsersService(
      this.getDatabaseConnection(),
      this.getTransactionalEmailAPI()
    );
  }
  public getUsersService(): UsersService {
    if (!this.usersService) this.usersService = this.createUsersService();
    return this.usersService;
  }

  // CONTROLLERS
  private createControllers(): {
    usersController: UsersController;
  } {
    return {
      usersController: new UsersController(
        this.getUsersService(),
        userErrorHandler
      ),
    };
  }

  // WEB SERVER
  private createWebServer(): WebServer {
    const controllers = this.createControllers();
    return new WebServer({ port: 3000 }, controllers);
  }

  public getWebServer(): WebServer {
    if (!this.webServer) this.webServer = this.createWebServer();
    return this.webServer;
  }

  private mountRoutes() {
    this.marketingModule.mountRouter(this.getWebServer());
    this.postsModule.mountRouter(this.getWebServer());
  }
}
