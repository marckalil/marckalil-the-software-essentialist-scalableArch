import { PuppeteerPageDriver } from "../driver/puppeteerPageDriver";
import { Component } from "./component";

export class AppNotifications extends Component {
  constructor(driver: PuppeteerPageDriver) {
    super(driver);
  }

  async getErrorNotificationText() {
    const errorNotification = await this.driver.page
      .waitForSelector("#failure-toast", { timeout: 2000 })
      .then((el) => {
        return el?.evaluate((e) => e.textContent);
      });
    return errorNotification;
  }
}
