import { CompositionRootConfig } from "../config/compositionRootConfig";
import { Database } from "../database";
import { WebServer } from "../webServer";

import { MarketingModule } from "../../modules/marketing/marketingModule";
import { NotificationsModule } from "../../modules/notifications/notificationsModule";
import { PostsModule } from "../../modules/posts";
import { UsersModule } from "../../modules/users";

export class CompositionRoot {
  private static instance: CompositionRoot;
  private config: CompositionRootConfig;
  private databaseConnection: Database;
  private readonly notificationsModule: NotificationsModule;
  private marketingModule: MarketingModule;
  private postsModule: PostsModule;
  private usersModule: UsersModule;
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
    this.notificationsModule = this.createNotificationsModule();
    this.marketingModule = this.createMarketingModule();
    this.postsModule = this.createPostsModule();
    this.usersModule = this.createUsersModule();
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
  private createNotificationsModule(): NotificationsModule {
    return NotificationsModule.build();
  }
  private createMarketingModule(): MarketingModule {
    return MarketingModule.build();
  }
  private createPostsModule(): PostsModule {
    return PostsModule.build(this.getDatabaseConnection());
  }
  private createUsersModule(): UsersModule {
    return UsersModule.build(
      this.getDatabaseConnection(),
      this.notificationsModule.getTransactionalEmailAPI()
    );
  }

  // WEB SERVER
  private createWebServer(): WebServer {
    return new WebServer({ port: 3000 });
  }
  public getWebServer(): WebServer {
    if (!this.webServer) this.webServer = this.createWebServer();
    return this.webServer;
  }
  private mountRoutes() {
    this.marketingModule.mountRouter(this.getWebServer());
    this.postsModule.mountRouter(this.getWebServer());
    this.usersModule.mountRouter(this.getWebServer());
  }
}
