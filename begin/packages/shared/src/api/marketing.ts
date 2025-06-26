import axios from "axios";
import { APIResponse, GenericErrors } from ".";

export type AddEmailToListErrors = GenericErrors;
export type AddEmailToListResponse = APIResponse<boolean, AddEmailToListErrors>;

export type MarketingResponse = AddEmailToListResponse;

export const createMarketingAPI = (apiURL: string) => ({
  addEmailToList: async (email: string) => {
    try {
      const successResponse = await axios.post(`${apiURL}/marketing/new`, {
        email,
      });
      return successResponse.data as AddEmailToListResponse;
    } catch (err) {
      // @ts-ignore
      return err.response.data as AddEmailToListErrors;
    }
  },
});
