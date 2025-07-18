import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { PageObject } from "./PageObject";
import { PuppeteerPageDriver } from "../driver";

export class RegistrationPage extends PageObject {
  constructor(driver: PuppeteerPageDriver) {
    super(driver, "http://localhost:5173/join");
  }

  public async enterFormDetails(userInput: CreateUserInput): Promise<void> {
    // TODO: Implement form field filling
  }

  public async acceptMarketingEmails(): Promise<void> {
    // TODO: Implement marketing emails checkbox selection
  }

  public async submitForm(): Promise<void> {
    // TODO: Implement form submission
  }
}
