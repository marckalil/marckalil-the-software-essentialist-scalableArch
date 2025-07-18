import type { Express } from "express";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";

import { createAPIClient } from "@dddforum/shared/src/api";
import { CreateUserInputBuilder } from "@dddforum/shared/tests/support/builders/CreateUserInputBuilder";
import { DatabaseFixtures } from "@dddforum/shared/tests/support/fixtures/databaseFixtures";
import { sharedTestRoot } from "@dddforum/shared/src/paths";
import type { CreateUserInput } from "@dddforum/shared/src/api/users";

import { CompositionRootConfig } from "../../src/shared/config/compositionRootConfig";
import { CompositionRoot } from "../../src/shared/compositionRoot";
import { WebServer } from "../../src/shared/webServer";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature")
);

defineFeature(feature, (test) => {
  const apiClient = createAPIClient("http://localhost:3000");
  let app: Express;
  let webServer: WebServer;
  let databaseFixtures: DatabaseFixtures;

  beforeAll(async () => {
    const compositionRootConfig = new CompositionRootConfig("test:e2e");
    const compositionRoot = CompositionRoot.createCompositionRoot(
      compositionRootConfig
    );
    webServer = compositionRoot.getWebServer();
    app = webServer.getApplication();
    const databaseConnection = compositionRoot.getDatabaseConnection();
    databaseFixtures = new DatabaseFixtures(databaseConnection.getConnection());
    await webServer.start();
    await databaseConnection.connect();
  });

  afterAll(async () => {
    await webServer.stop();
  });

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
        createUserResponse = await apiClient.users.register(createUserInput);
        addEmailToMarketingList = await apiClient.marketing.addEmailToList(
          createUserInput.email
        );
      }
    );
    then("I should be granted access to my account", () => {
      // expect(createUserResponse.status).toBe(201);
      const { data, error, success } = createUserResponse;
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
      // expect(addEmailToMarketingList.status).toBe(201);
      expect(addEmailToMarketingList).toHaveProperty("success", true);
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let addEmailToMarketingList: any = {};
    let createUserResponse: any = {};
    let createUserInput: CreateUserInput;
    given("I am a new user", async () => {
      createUserInput = new CreateUserInputBuilder()
        .withAllRandomDetails()
        .withEmail("x@y.com")
        .withFirstName("John")
        .withLastName("Doe")
        .withUsername("johndoe")
        .build();
    });
    when(
      "I register with valid account details declining marketing emails",
      async () => {
        createUserResponse = await apiClient.users.register(createUserInput);
      }
    );
    then("I should be granted access to my account", () => {
      // expect(createUserResponse.status).toBe(201);
      const { data, error, success } = createUserResponse;
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(data).toBeDefined();
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("email", createUserInput.email);
      expect(data).toHaveProperty("firstName", createUserInput.firstName);
      expect(data).toHaveProperty("lastName", createUserInput.lastName);
      expect(data).toHaveProperty("username", createUserInput.username);
    });
    and("I should not expect to receive marketing emails", () => {
      // To fill in later
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    let inValidUserInput: Partial<CreateUserInput> = {};
    let response: any = {};
    given("I am a new user", () => {
      const createUserInput =
        new CreateUserInputBuilder().withAllRandomDetails();
      inValidUserInput = {
        ...createUserInput,
        email: undefined,
      };
    });
    when("I register with invalid account details", async () => {
      response = await apiClient.users.register(
        inValidUserInput as CreateUserInput
      );
    });
    then("I should see an error notifying me that my input is invalid", () => {
      // expect(response.status).toBe(400);
      expect(response).toHaveProperty("success", false);
      expect(response).toHaveProperty("error", "ValidationError");
    });
    and("I should not have been sent access to account details", () => {
      expect(response).not.toHaveProperty("data");
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let newUsers: CreateUserInput[] = [];
    let createUserResponses: any[] = [];
    given("a set of users already created accounts", async (table) => {
      const existingUsers = table.map((row: any) =>
        new CreateUserInputBuilder()
          .withAllRandomDetails()
          .withEmail(row.email)
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .build()
      );
      await databaseFixtures.setUpWithExistingUsers(existingUsers);
      newUsers = existingUsers.map((user: CreateUserInput) => {
        return new CreateUserInputBuilder()
          .withAllRandomDetails()
          .withEmail(user.email)
          .build();
      });
    });
    when("new users attempt to register with those emails", async () => {
      createUserResponses = await Promise.all(
        newUsers.map((input) => apiClient.users.register(input))
      );
    });
    then(
      "they should see an error notifying them that the account already exists",
      () => {
        for (const response of createUserResponses) {
          // expect(response.status).toBe(409);
          expect(response).toHaveProperty("success", false);
          expect(response).toHaveProperty("error", "EmailAlreadyInUse");
        }
      }
    );
    and("they should not have been sent access to account details", () => {
      for (const response of createUserResponses) {
        expect(response).not.toHaveProperty("data");
      }
    });
  });

  test("Username already taken", ({ given, when, then, and }) => {
    let newUsers: CreateUserInput[] = [];
    let createUserResponses: any[] = [];
    given(
      "a set of users have already created their accounts with valid details",
      async (table) => {
        const existingUsers = table.map((row: any) =>
          new CreateUserInputBuilder()
            .withAllRandomDetails()
            .withEmail(row.email)
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .withUsername(row.firstName + row.lastName)
            .build()
        );
        await databaseFixtures.setUpWithExistingUsers(existingUsers);
        newUsers = existingUsers.map((user: CreateUserInput) => {
          return new CreateUserInputBuilder()
            .withAllRandomDetails()
            .withUsername(user.username)
            .build();
        });
      }
    );
    when(
      "new users attempt to register with already taken usernames",
      async () => {
        createUserResponses = await Promise.all(
          newUsers.map((input) => apiClient.users.register(input))
        );
      }
    );
    then(
      "they see an error notifying them that the username has already been taken",
      () => {
        for (const response of createUserResponses) {
          // expect(response.status).toBe(409);
          expect(response).toHaveProperty("success", false);
          expect(response).toHaveProperty("error", "UsernameAlreadyTaken");
        }
      }
    );
    and("they should not have been sent access to account details", () => {
      for (const response of createUserResponses) {
        expect(response).not.toHaveProperty("data");
      }
    });
  });
});
