import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "path";

import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { CreateUserInputBuilder } from "@dddforum/shared/tests/support/builders/CreateUserInputBuilder";
import { DatabaseFixtures } from "@dddforum/shared/tests/support/fixtures/databaseFixtures";
import { sharedTestRoot } from "@dddforum/shared/src/paths";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature"),
  { tagFilter: "@frontend" }
);

defineFeature(feature, (test) => {
  let userInput: CreateUserInput;
  let databaseFixtures: DatabaseFixtures;
  let app: App;
  let pages: Pages;
  let layout: Layout;
  let puppeteerPageDriver: PuppeteerPageDriver;

  beforeAll(async () => {
    databaseFixtures = new DatabaseFixtures();
    puppeteerPageDriver = await PuppeteerPageDriver.create({
      headless: false,
      slowMo: 50,
    });
    app = createAppObject(puppeteerPageDriver);
    pages = app.pages();
    layout = app.layout();
  });

  beforeEach(async () => {
    await databaseFixtures.reset();
  });

  afterAll(async () => {
    await puppeteerPageDriver.browser.close();
  });

  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {
      userInput = new CreateUserInputBuilder().withAllRandomDetails().build();
    });
    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        await pages.registration.open();
        await pages.registration.enterFormDetails(userInput);
        await pages.registration.acceptMarketingEmails();
        await pages.registration.submitForm();
      }
    );
    then("I should be granted access to my account", async () => {
      const username = await layout.header.getLoggedInUserName();
      expect(username).toBeDefined();
      expect(username).toContain(userInput.username);
    });
    and("I should expect to receive marketing emails", () => {
      // @See backend
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});
    when("I register with invalid account details", async () => {});
    then(
      "I should see an error notifying me that my input is invalid",
      async () => {}
    );
    and("I should not have been sent access to account details", () => {
      // @See backend
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    given("a set of users already created accounts", () => {});
    when("new users attempt to register with those emails", async () => {});
    then(
      "they should see an error notifying them that the account already exists",
      async () => {}
    );
    and("they should not have been sent access to account details", () => {
      // @See backend
    });
  });
});
