import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";

import type { CreateUserInput } from "@dddforum/shared/src/api/users";
import { sharedTestRoot } from "@dddforum/shared/src/paths";

import { app } from "../../src/index";
import { CreateUserInputBuilder } from "../support/builders/CreateUserInputBuilder";
import { databaseFixtures } from "../support/fixtures/databaseFixtures";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await databaseFixtures.reset();
  });

  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let addEmailToMarketingList: any = {};
    let createUserResponse: any = {};
    let createUserInput: CreateUserInput;

    given("I am a new user", () => {
      createUserInput = new CreateUserInputBuilder()
        .withAllRandomDetails()
        .withEmail("x@y.com")
        .withFirstName("John")
        .withLastName("Doe")
        .withUsername("johndoe")
        .build();
    });
    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        createUserResponse = await request(app)
          .post("/users/new")
          .send(createUserInput);
        addEmailToMarketingList = await request(app)
          .post("/marketing/new")
          .send({ email: createUserInput.email });
      }
    );
    then("I should be granted access to my account", () => {
      expect(createUserResponse.status).toBe(201);
      const { data, error, success } = createUserResponse.body;
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(data).toBeDefined();
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("email", createUserInput.email);
      expect(data).toHaveProperty("firstName", createUserInput.firstName);
      expect(data).toHaveProperty("lastName", createUserInput.lastName);
      expect(data).toHaveProperty("username", createUserInput.username);
    });
    and("I should expect to receive marketing emails", () => {
      expect(addEmailToMarketingList.status).toBe(201);
    });
  });

  test.skip("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});
    when(
      "I register with valid account details declining marketing emails",
      () => {}
    );
    then("I should be granted access to my account", () => {});
    and("I should not expect to receive marketing emails", () => {});
  });

  test.skip("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});
    when("I register with invalid account details", () => {});
    then(
      "I should see an error notifying me that my input is invalid",
      () => {}
    );
    and("I should not have been sent access to account details", () => {});
  });

  test.skip("Account already created with email", ({
    given,
    when,
    then,
    and,
  }) => {
    given("a set of users already created accounts", (table) => {});
    when("new users attempt to register with those emails", () => {});
    then(
      "they should see an error notifying them that the account already exists",
      () => {}
    );
    and("they should not have been sent access to account details", () => {});
  });

  test.skip("Username already taken", ({ given, when, then, and }) => {
    given(
      "a set of users have already created their accounts with valid details",
      (table) => {}
    );
    when(
      "new users attempt to register with already taken usernames",
      (table) => {}
    );
    then(
      "they see an error notifying them that the username has already been taken",
      () => {}
    );
    and("they should not have been sent access to account details", () => {});
  });
});
