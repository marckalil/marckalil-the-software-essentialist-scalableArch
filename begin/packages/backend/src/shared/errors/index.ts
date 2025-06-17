import type { NextFunction, Request, Response } from "express";
import { CustomException } from "../exceptions";

export const Errors = {
  UsernameAlreadyTaken: "UsernameAlreadyTaken",
  EmailAlreadyInUse: "EmailAlreadyInUse",
  ValidationError: "ValidationError",
  ServerError: "ServerError",
  ClientError: "ClientError",
  UserNotFound: "UserNotFound",
};

export type ErrorHandler = (
  error: CustomException,
  req: Request,
  res: Response,
  next: NextFunction
) => Response;
