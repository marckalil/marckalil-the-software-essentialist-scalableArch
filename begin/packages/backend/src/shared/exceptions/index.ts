export class CustomException extends Error {
  public type: string;
  constructor(message: string, type: string = "CustomException") {
    super(message);
    this.type = type;
  }
}

class InvalidRequestBodyException extends CustomException {
  constructor(missingKeys: string[]) {
    super(
      "Body is missing required key: " + missingKeys.join(", "),
      "InvalidRequestBodyException"
    );
  }
}

export class ValidationErrorException extends CustomException {
  constructor() {
    super("An error occurred", "ValidationErrorException");
  }
}

class ServerErrorException extends CustomException {
  constructor() {
    super("An error occurred", "ServerErrorException");
  }
}

export class EmailAlreadyInUseException extends CustomException {
  constructor() {
    super("An error occurred", "EmailAlreadyInUseException");
  }
}

export class UsernameAlreadyTakenException extends CustomException {
  constructor() {
    super("An error occurred", "UsernameAlreadyTakenException");
  }
}

export class UserNotFoundException extends CustomException {
  constructor() {
    super("An error occurred", "UserNotFoundException");
  }
}

export { InvalidRequestBodyException, ServerErrorException };
