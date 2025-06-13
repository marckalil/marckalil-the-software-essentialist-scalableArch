import express from "express";
import type { AddEmailToListResponse } from "@dddforum/shared/src/api/marketing";
import type { MarketingService } from "./marketingService";
import { ErrorHandler } from "../../shared/errors";

export class MarketingController {
  private readonly router: express.Router;

  constructor(
    private readonly marketingService: MarketingService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupRoutes() {
    this.router.post("/new", this.addEmailToMarketingList.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  public getRouter(): express.Router {
    return this.router;
  }

  private async addEmailToMarketingList(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email } = req.body;
      const result = await this.marketingService.addEmailToList(email);
      const response: AddEmailToListResponse = {
        success: true,
        data: result,
        error: {},
      };
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
