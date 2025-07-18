import { Component, PageElements } from "./component";
import { PuppeteerPageDriver } from "../driver";

export class HeaderComponent extends Component {
  private elements: PageElements;

  constructor(driver: PuppeteerPageDriver) {
    super(driver);
    this.elements = new PageElements(
      {
        header: { selector: ".header.username", type: "div" },
      },
      driver
    );
  }

  async getUsernameFromHeader() {
    const usernameElement = await this.elements.get("header");
    return usernameElement?.evaluate((e) => e.textContent);
  }
}
