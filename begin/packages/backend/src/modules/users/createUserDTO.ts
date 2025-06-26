import { InvalidRequestBodyException } from "../../shared/exceptions";
import { isMissingKeys } from "../../shared/utils";

export class CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  username: string;

  constructor({
    email,
    firstName,
    lastName,
    username,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  }) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
  }

  static fromRequest(body: unknown): CreateUserDTO {
    const requiredKeys = ["email", "firstName", "lastName", "username"];
    const keyIsMissing =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (keyIsMissing) throw new InvalidRequestBodyException(requiredKeys);

    const { email, firstName, lastName, username } = body as {
      email: string;
      firstName: string;
      lastName: string;
      username: string;
    };

    return new CreateUserDTO({
      email,
      firstName,
      lastName,
      username,
    });
  }
}
