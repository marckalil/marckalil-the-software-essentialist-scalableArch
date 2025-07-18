import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { CreateUserInput } from "@dddforum/shared/src/api/users";

import { api } from "../App";
import { Layout } from "../components/layout";
import { OverlaySpinner } from "../components/overlaySpinner";
import { RegistrationForm } from "../components/registrationForm";
import { useSpinner } from "../contexts/spinnerContext";
import { useUser } from "../contexts/userContext";
import { toId, appSelectors } from "../../shared/selectors";

type ValidationResult = {
  success: boolean;
  errorMessage?: string;
};

function validateForm(input: CreateUserInput): ValidationResult {
  if (input.email.indexOf("@") === -1)
    return { success: false, errorMessage: "Email invalid" };
  if (input.username.length < 2)
    return { success: false, errorMessage: "Username invalid" };
  return { success: true };
}

export const RegisterPage = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const spinner = useSpinner();

  const handleSubmitRegistrationForm = async (
    input: CreateUserInput,
    addToList: boolean
  ) => {
    // Validate the form
    const validationResult = validateForm(input);

    // If the form is invalid
    if (!validationResult.success) {
      // Show an error toast (for invalid input)
      return toast.error(validationResult.errorMessage, {
        toastId: toId(appSelectors.notifications.failure),
      });
    }

    spinner.activate();

    try {
      const response = await api.users.register(input);

      if (!response.success) {
        switch (response.error.code) {
          case "UsernameAlreadyTaken":
            spinner.deactivate();
            return toast.error("Account already exists", {
              toastId: toId(appSelectors.notifications.failure),
            });
          case "EmailAlreadyInUse":
            spinner.deactivate();
            return toast.error("Email already in use", {
              toastId: toId(appSelectors.notifications.failure),
            });
          default:
            // Client processing error
            throw new Error("Unknown error: " + response.error.code);
        }
      }

      if (addToList) {
        await api.marketing.addEmailToList(input.email);
      }

      // Save the user details to the cache
      setUser(response.data as any);
      // Stop the loading spinner
      spinner.deactivate();
      // Show the toast
      toast("Success! Redirecting home.", {
        toastId: toId(appSelectors.notifications.success),
      });
      // In 3 seconds, redirect to the main page
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      // If the call failed
      // Stop the spinner
      spinner.deactivate();
      // Show the toast (for unknown error)
      return toast.error("Some backend error occurred", {
        toastId: toId(appSelectors.notifications.failure),
      });
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div>Create Account</div>
      <RegistrationForm
        onSubmit={(input: CreateUserInput, allowMarketingEmails: boolean) =>
          handleSubmitRegistrationForm(input, allowMarketingEmails)
        }
      />
      <OverlaySpinner isActive={spinner.spinner?.isActive} />
    </Layout>
  );
};
