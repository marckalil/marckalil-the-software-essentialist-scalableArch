import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { PageObject } from "./PageObject";
import { PuppeteerPageDriver } from "../driver";
import { create } from "domain";

export class RegistrationPage extends PageObject {
  private elements: PageElements;
  constructor(driver: PuppeteerPageDriver) {
    super(driver, "http://localhost:5173/join");
    this.elements = this.createPageElements();
  }

  private createPageElements(): PageElements {
    return new PageElements({
      email: { selector: ".registration.email", type: "input" },
      firstName: { selector: ".registration.first-name", type: "input" },
      lastName: { selector: ".registration.last-name", type: "input" },
      username: { selector: ".registration.username", type: "input" },
      marketingCheckbox: {
        selector: ".registration.marketing-checkbox",
        type: "checkbox",
      },
      submitButton: { selector: ".registration.submit-button", type: "button" },
    });
  }

  public async enterFormDetails(userInput: CreateUserInput): Promise<void> {
    this.elements.get("email").then((element) => element.type(userInput.email));
    this.elements
      .get("firstName")
      .then((element) => element.type(userInput.firstName));
    this.elements
      .get("lastName")
      .then((element) => element.type(userInput.lastName));
    this.elements
      .get("username")
      .then((element) => element.type(userInput.username));
  }

  public async acceptMarketingEmails(): Promise<void> {
    this.elements.get("marketingCheckbox").then((element) => element.click());
  }

  public async submitForm(): Promise<void> {
    this.elements.get("submitButton").then((element) => element.click());
  }
}
