import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { PageObject } from "./PageObject";
import { PuppeteerPageDriver } from "../driver";
import { PageElements } from "../components/component";

export class RegistrationPage extends PageObject {
  private elements: PageElements;
  constructor(driver: PuppeteerPageDriver) {
    super(driver, "http://localhost:5173/join");
    this.elements = this.createPageElements();
  }

  private createPageElements(): PageElements {
    return new PageElements(
      {
        email: { selector: ".registration.email", type: "input" },
        username: { selector: ".registration.username", type: "input" },
        firstName: { selector: ".registration.first-name", type: "input" },
        lastName: { selector: ".registration.last-name", type: "input" },
        marketingCheckbox: {
          selector: ".registration.marketing-checkbox",
          type: "checkbox",
        },
        submitButton: {
          selector: ".registration.submit-button",
          type: "button",
        },
      },
      this.driver
    );
  }

  public async enterFormDetails(userInput: CreateUserInput): Promise<void> {
    const emailElement = await this.elements.get("email");
    await emailElement.type(userInput.email);

    const usernameElement = await this.elements.get("username");
    await usernameElement.type(userInput.username);

    const firstNameElement = await this.elements.get("firstName");
    await firstNameElement.type(userInput.firstName);

    const lastNameElement = await this.elements.get("lastName");
    await lastNameElement.type(userInput.lastName);
  }

  public async acceptMarketingEmails(): Promise<void> {
    const checkboxElement = await this.elements.get("marketingCheckbox");
    await checkboxElement.click();
  }

  public async submitForm(): Promise<void> {
    const submitElement = await this.elements.get("submitButton");
    await submitElement.click();
  }
}
