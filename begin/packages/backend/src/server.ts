import express, { Express } from "express";
import { Server as HttpServer } from "http";

import { UsersController } from "./modules/users/usersController";
import { MarketingController } from "./modules/marketing";
import { PostsController } from "./modules/posts/postsController";

const cors = require("cors");

export class Server {
  private _instance: Express;

  constructor(
    private readonly usersController: UsersController,
    private readonly marketingController: MarketingController,
    private readonly postsController: PostsController
  ) {
    this._instance = express();
    this.addMiddleware();
    this.registerRoutes();
  }

  private addMiddleware() {
    this._instance.use(express.json());
    this._instance.use(cors());
  }

  private registerRoutes() {
    this._instance.use("/users", this.usersController.getRouter());
    this._instance.use("/marketing", this.marketingController.getRouter());
    this._instance.use("/posts", this.postsController.getRouter());
  }

  public start(port: number) {
    const httpServer = this._instance.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    this.enableGracefulShutdown(httpServer);
  }

  private enableGracefulShutdown(httpServer: HttpServer) {
    const gracefullyShutdown = (signalType: string) => {
      console.log(`Received ${signalType}. Shutting down gracefully...`);
      httpServer.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
      setTimeout(() => {
        console.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => {
      gracefullyShutdown("SIGINT");
    });
    process.on("SIGTERM", () => {
      gracefullyShutdown("SIGTERM");
    });
  }
}
