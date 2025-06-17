import { APIResponse, GenericErrors } from ".";
export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

export type EmailAlreadyInUseError = "EmailAlreadyInUse";
export type UsernameAlreadyTakenError = "UsernameAlreadyTaken";
export type CreateUserErrors =
  | GenericErrors
  | EmailAlreadyInUseError
  | UsernameAlreadyTakenError;
export type CreateUserResponse = APIResponse<boolean, CreateUserErrors>;

export type UsersResponse = APIResponse<
  CreateUserResponse | null,
  CreateUserErrors
>;
