import { createAPIClient } from "@dddforum/shared/src/api";
/*
import { RegistrationInput } from "./components/registrationForm";

export const api = {
  posts: {
    getPosts: () => {
      return axios.get("http://localhost:3000/posts?sort=recent");
    },
  },
  register: (input: RegistrationInput) => {
    return axios.post("http://localhost:3000/users/new", {
      ...input,
    });
  },
};
*/

export const api = createAPIClient("http://localhost:3000");
