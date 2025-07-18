import { PuppeteerPageDriver } from "../driver";

export abstract class Component {
  protected driver: PuppeteerPageDriver;

  constructor(driver: PuppeteerPageDriver) {
    this.driver = driver;
  }
}
