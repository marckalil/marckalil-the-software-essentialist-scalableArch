import { NextFunction, Request, Response } from "express";
import { ClientErrorException, CustomException } from "../../shared/exceptions";
import { PostsResponse } from "@dddforum/shared/src/api/posts";

export function postsErrorHandler(
  err: CustomException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let responseBody: PostsResponse;

  if (err instanceof ClientErrorException) {
    responseBody = {
      data: [],
      success: false,
      error: {
        code: "ClientError",
      },
    };
    return res.status(400).json(responseBody);
  }

  responseBody = {
    success: false,
    data: [],
    error: {
      code: "ServerError",
    },
  };

  return res.status(500).json(responseBody);
}
