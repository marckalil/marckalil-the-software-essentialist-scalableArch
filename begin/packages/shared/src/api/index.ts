import { createMarketingAPI } from "./marketing";
import { createUsersAPI } from "./users";

export type Error<U> = {
  message?: string;
  code?: U;
};

export type APIResponse<T, U> = {
  success: boolean;
  data: T;
  error: Error<U>;
};

export type ValidationError = "ValidationError";
export type ServerError = "ServerError";
export type ClientError = "ClientError";
export type GenericErrors = ValidationError | ServerError | ClientError;

export function createAPIClient(apiURL: string) {
  return {
    users: createUsersAPI(apiURL),
    marketing: createMarketingAPI(apiURL),
    // posts: createPostsAPI(apiURL),
  };
}
