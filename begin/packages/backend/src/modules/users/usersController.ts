import { NextFunction, Request, Response, Router } from "express";
import { ErrorHandler } from "../../shared/errors";
import { CreateUserDTO } from "./createUserDTO";
import { UsersService } from "./usersService";

export class UsersController {
  private readonly router: Router;
  constructor(
    private readonly usersService: UsersService,
    private readonly errorHandler: ErrorHandler
  ) {
    this.router = Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private setupRoutes() {
    this.router.post("/new", this.createUser.bind(this));
    this.router.get("/:email", this.getUserByEmail.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = CreateUserDTO.fromRequest(req.body);
      const user = await this.usersService.createUser(userData);
      return res.status(201).json({
        error: undefined,
        data: user,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email = req.query.email as string;
      const user = await this.usersService.getUserByEmail(email);

      return res.status(200).json({
        error: undefined,
        data: user,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
