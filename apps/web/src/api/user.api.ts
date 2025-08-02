import { IUser } from "@tunnel/interfaces";
import { http } from "./lib/axios";
import { handleApiError } from "~/lib/helpers";
import { publicHttp } from "./lib/axios-public";

export const user = {
  getUser: async ({ logout = true }: { logout: boolean }) => {
    try {
      if (logout) {
        const { data } = await http.get<{ user: IUser }>("/user");
        return data;
      } else {
        const { data } = await publicHttp.get<{ user: IUser }>("/user");
        return data;
      }
    } catch (error) {
      return handleApiError(error);
    }
  },
};
