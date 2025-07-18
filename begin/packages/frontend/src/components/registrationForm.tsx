import React, { useState } from "react";
import { Link } from "react-router-dom";

import { CreateUserInput } from "@dddforum/shared/src/api/users";

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
        className="registration email"
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        className="registration username"
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        className="registration first-name"
        type="text"
        placeholder="first name"
        onChange={(e) => setFirstName(e.target.value)}
      ></input>
      <input
        className="registration last-name"
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
          className="registration submit-button"
          type="submit"
        >
          Submit
        </button>
        <label>
          <input
            className="registration marketing-checkbox"
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
