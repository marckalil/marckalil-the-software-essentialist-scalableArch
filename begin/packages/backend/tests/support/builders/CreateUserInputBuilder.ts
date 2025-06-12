import type { CreateUserInput } from "../../../shared/user/types";
import { TextUtils } from "../../../shared/utils/TextUtils";

export class CreateUserInputBuilder {
  props: CreateUserInput;

  constructor() {
    this.props = {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
    };
  }

  public withAllRandomDetails() {
    this.withEmail(TextUtils.createRandomText(10));
    this.withFirstName(TextUtils.createRandomText(10));
    this.withLastName(TextUtils.createRandomText(10));
    this.withUsername(TextUtils.createRandomText(10));
    return this;
  }

  public withEmail(email: string) {
    this.props = {
      ...this.props,
      email,
    };
    return this;
  }

  public withFirstName(firstName: string) {
    this.props = {
      ...this.props,
      firstName,
    };
    return this;
  }

  public withLastName(lastName: string) {
    this.props = {
      ...this.props,
      lastName,
    };
    return this;
  }

  public withUsername(username: string) {
    this.props = {
      ...this.props,
      username,
    };
    return this;
  }

  public build(): CreateUserInput {
    return this.props;
  }
}
