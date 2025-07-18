import { PuppeteerPageDriver } from "../driver";

export abstract class Component {
  protected driver: PuppeteerPageDriver;

  constructor(driver: PuppeteerPageDriver) {
    this.driver = driver;
  }
}

type ElementType = "input" | "checkbox" | "button" | "div";

export type PageElementSelector =
  | {
      selector: string;
      type: ElementType;
    }
  | Component;
export interface PageElementsConfig {
  [key: string]: PageElementSelector;
}

export class PageElements {
  constructor(
    private elementsConfig: PageElementsConfig,
    private driver: PuppeteerPageDriver
  ) {}

  public async get(key: string, timeout?: number) {
    const component = this.elementsConfig[key];
    let element;

    if (component instanceof Component) {
      return component;
    }

    try {
      element = await this.driver.page.waitForSelector(component.selector, {
        timeout,
      });
    } catch (error) {
      console.error(`Element not found: ${key}`);
      throw new Error(`Element not found: ${key}`);
    }

    return element;
  }
}
