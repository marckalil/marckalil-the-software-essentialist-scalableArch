import express, { Express } from "express";
import { Server as HttpServer } from "http";

import { UsersController } from "../../modules/users/usersController";
import { MarketingController } from "../../modules/marketing";

const cors = require("cors");

export class WebServer {
  private app: Express;
  private httpServer: HttpServer | undefined;
  private state: "started" | "stopped";
  private readonly port: number;
  private readonly usersController: UsersController;
  private readonly marketingController: MarketingController;

  constructor(
    { port }: { port: number },
    controllers: {
      usersController: UsersController;
      marketingController: MarketingController;
    }
  ) {
    this.app = express();
    this.state = "stopped";
    this.port = port;
    this.usersController = controllers.usersController;
    this.marketingController = controllers.marketingController;
    this.addMiddleware();
    this.registerRoutes();
  }

  public getApplication(): Express {
    return this.app;
  }

  private addMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private registerRoutes() {
    this.app.use("/users", this.usersController.getRouter());
    this.app.use("/marketing", this.marketingController.getRouter());
  }

  public mountRouter(path: string, router: express.Router): void {
    this.app.use(path, router);
  }

  public stop(): Promise<void> {
    const port = Number(process.env.PORT || this.port);
    return new Promise((resolve, reject) => {
      if (!this.httpServer) return reject(`No server running on port ${port}.`);
      this.httpServer.close();
      console.log(`Server on port ${port} has been stopped.`);
      this.state = "stopped";
      resolve();
    });
  }

  public async start(): Promise<void> {
    const port = Number(process.env.PORT || this.port);
    return new Promise((resolve, reject) => {
      console.log(`Starting server on port ${port}...`);
      this.httpServer = this.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
      this.state = "started";
      this.enableGracefulShutdown(this.httpServer);
      resolve();
    });
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
