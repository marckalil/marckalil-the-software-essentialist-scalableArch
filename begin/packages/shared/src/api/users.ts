import axios from "axios";

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

export type GetUserByEmailErrors = GenericErrors | "UserNotFound";
export type GetUserErrors = GetUserByEmailErrors | CreateUserErrors;

export type CreateUserResponse = APIResponse<User, CreateUserErrors>;
export type GetUserByEmailResponse = APIResponse<User, GetUserErrors>;

export type UsersResponse = CreateUserResponse | GetUserByEmailResponse;

export const createUsersAPI = (apiURL: string) => ({
  register: async (input: CreateUserInput) => {
    try {
      const successResponse = await axios.post(`${apiURL}/users/new`, input);
      return successResponse.data as CreateUserResponse;
    } catch (err) {
      // @ts-ignore
      return err.response.data as CreateUserResponse;
    }
  },
  getUserByEmail: async (email: string) => {
    try {
      const successResponse = await axios.get(`${apiURL}/users/${email}`);
      return successResponse.data as GetUserByEmailResponse;
    } catch (err) {
      // @ts-ignore
      return err.response.data as GetUserErrors;
    }
  },
});
