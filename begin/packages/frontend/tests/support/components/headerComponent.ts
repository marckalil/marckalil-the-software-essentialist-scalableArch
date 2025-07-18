import { Component, PageElements, PageElementSelector } from "./component";
import { PuppeteerPageDriver } from "../driver";
import { appSelectors } from "../../../shared/selectors";

export class HeaderComponent extends Component {
  private elements: PageElements;

  constructor(driver: PuppeteerPageDriver) {
    super(driver);
    this.elements = new PageElements(
      {
        header: appSelectors.header as PageElementSelector,
      },
      driver
    );
  }

  async getUsernameFromHeader() {
    const usernameElement = await this.elements.get("header");
    return usernameElement?.evaluate((e) => e.textContent);
  }
}
