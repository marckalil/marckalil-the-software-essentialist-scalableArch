import React, { useState } from "react";
import { Link } from "react-router-dom";

import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { toClass, appSelectors } from "../../shared/selectors";

interface RegistrationFormProps {
  onSubmit: (
    formDetails: CreateUserInput,
    allowMarketingEmails: boolean
  ) => void;
}

export const RegistrationForm = (props: RegistrationFormProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [allowMarketingEmails, setAllowMarketingEmails] = useState(false);

  const toggleAllowMarketingEmails = () => {
    setAllowMarketingEmails(!allowMarketingEmails);
  };

  const handleSubmit = () => {
    props.onSubmit(
      {
        email,
        username,
        firstName,
        lastName,
      },
      allowMarketingEmails
    );
  };

  return (
    <div className="registration-form">
      <div>Create Account</div>
      <input
        className={toClass(
          appSelectors.registration.registrationForm.email.selector
        )}
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        className={toClass(
          appSelectors.registration.registrationForm.username.selector
        )}
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        className={toClass(
          appSelectors.registration.registrationForm.firstname.selector
        )}
        type="text"
        placeholder="first name"
        onChange={(e) => setFirstName(e.target.value)}
      ></input>
      <input
        className={toClass(
          appSelectors.registration.registrationForm.lastname.selector
        )}
        type="text"
        placeholder="last name"
        onChange={(e) => setLastName(e.target.value)}
      ></input>
      <div>
        <div className="to-login">
          <div>Already have an account?</div>
          <Link to="/login">Login</Link>
        </div>
        <button
          onClick={() => handleSubmit()}
          className={toClass(
            appSelectors.registration.registrationForm.submit.selector
          )}
          type="submit"
        >
          Submit
        </button>
        <label>
          <input
            className={toClass(
              appSelectors.registration.registrationForm.marketingCheckbox
                .selector
            )}
            type="checkbox"
            checked={allowMarketingEmails}
            onChange={() => toggleAllowMarketingEmails()}
          />
          Want to be notified about events & discounts?
        </label>
      </div>
    </div>
  );
};
