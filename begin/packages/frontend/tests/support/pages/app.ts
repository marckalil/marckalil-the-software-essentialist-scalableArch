import { PuppeteerPageDriver } from "../driver";
import { HeaderComponent } from "../components";
import { RegistrationPage } from "./registrationPage";

export interface App {
  pages: Pages;
  layout: Layout;
}

export interface Pages {
  registration: RegistrationPage;
  // Add other page interfaces as needed
}

export interface Layout {
  header: HeaderComponent;
  // Add other layout interfaces as needed
}

export function createAppObject(puppeteerPageDriver: PuppeteerPageDriver): App {
  return {
    pages: {
      registration: new RegistrationPage(puppeteerPageDriver),
    },
    layout: {
      header: new HeaderComponent(puppeteerPageDriver),
    },
  };
}
