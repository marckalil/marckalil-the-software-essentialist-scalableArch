import { CompositionRootConfig } from "../config/compositionRootConfig";
import { Database } from "../database";
import { WebServer } from "../webServer";

import { ContactListAPI } from "../../modules/marketing/contactListApi";
import { MarketingController } from "../../modules/marketing";
import { marketingErrorHandler } from "../../modules/marketing/marketingErrors";
import { MarketingService } from "../../modules/marketing/marketingService";

import { TransactionalEmailAPI } from "../../modules/notifications/transactionalEmailAPI";
import { userErrorHandler } from "../../modules/users/usersError";
import { UsersController } from "../../modules/users/usersController";
import { UsersService } from "../../modules/users/usersService";

import { PostsModule } from "../../modules/posts";

export class CompositionRoot {
  private static instance: CompositionRoot;
  private config: CompositionRootConfig;
  private databaseConnection: Database;
  private transactionalEmailAPI: TransactionalEmailAPI;
  private usersService: UsersService;
  private contactListAPI: ContactListAPI;
  private marketingService: MarketingService;
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
    this.contactListAPI = this.createContactListAPI();
    this.marketingService = this.createMarketingService();
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

  // CONTACT LIST API
  private createContactListAPI(): ContactListAPI {
    return new ContactListAPI();
  }
  public getContactListAPI(): ContactListAPI {
    if (!this.contactListAPI) this.contactListAPI = this.createContactListAPI();
    return this.contactListAPI;
  }

  // MARKETING
  private createMarketingService(): MarketingService {
    return new MarketingService(this.getContactListAPI());
  }
  public getMarketingService(): MarketingService {
    if (!this.marketingService)
      this.marketingService = this.createMarketingService();
    return this.marketingService;
  }

  // CONTROLLERS
  private createControllers(): {
    usersController: UsersController;
    marketingController: MarketingController;
  } {
    return {
      usersController: new UsersController(
        this.getUsersService(),
        userErrorHandler
      ),
      marketingController: new MarketingController(
        this.getMarketingService(),
        marketingErrorHandler
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
    this.postsModule.mountRouter(this.getWebServer());
  }
}
