import { NextFunction, Request, Response } from "express";

import { UsersResponse } from "@dddforum/shared/src/api/users";
import { CustomException } from "../../shared/exceptions";

export function userErrorHandler(
  error: CustomException,
  _: Request,
  res: Response,
  next: NextFunction
): Response<UsersResponse> {
  if (error.type === "InvalidRequestBodyException") {
    return res.status(400).json({
      error: { code: "ValidationError" },
      data: undefined,
      success: false,
    });
  }

  if (error.type === "EmailAlreadyInUseException") {
    return res.status(409).json({
      error: { code: "EmailAlreadyInUse" },
      data: undefined,
      success: false,
    });
  }

  if (error.type === "UsernameAlreadyTakenException") {
    return res.status(409).json({
      error: { code: "UsernameAlreadyTaken" },
      data: undefined,
      success: false,
    });
  }

  return res.status(500).json({
    error: { code: "ServerError" },
    data: undefined,
    success: false,
  });
}
