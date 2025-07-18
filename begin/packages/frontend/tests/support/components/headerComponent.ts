import { Component } from "./component";
import { PuppeteerPageDriver } from "../driver";

export class HeaderComponent extends Component {
  constructor(driver: PuppeteerPageDriver) {
    super(driver);
  }

  public async getLoggedInUserName(): Promise<string | undefined> {
    // TODO: Implement logic to get the logged in user's name from the header
    return undefined;
  }
}
