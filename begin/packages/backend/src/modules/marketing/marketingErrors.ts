import { NextFunction, Request, Response } from "express";
import { MarketingResponse } from "@dddforum/shared/src/api/marketing";
import { CustomException } from "../../shared/exceptions";

export function marketingErrorHandler(
  error: CustomException,
  _: Request,
  res: Response,
  next: NextFunction
): Response<MarketingResponse> {
  let responseBody: MarketingResponse;
  if (error.type === "InvalidRequestBodyException") {
    responseBody = {
      success: false,
      data: false,
      error: {
        message: error.message,
        code: "ValidationError",
      },
    };
    return res.status(400).json(responseBody);
  }

  responseBody = {
    success: false,
    data: false,
    error: {
      code: "ServerError",
    },
  };

  return res.status(500).json(responseBody);
}
