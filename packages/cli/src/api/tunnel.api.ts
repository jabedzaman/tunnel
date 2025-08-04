import { ITunnel } from "@tunnel/interfaces";
import { CreateTunnelPayload } from "@tunnel/validators";
import { http } from "~/libs";

export const tunnel = {
  create: async (payload: CreateTunnelPayload) => {
    try {
      const { data } = await http.post<{
        tunnel: ITunnel;
      }>("/tunnel", payload);
      return data;
    } catch (error) {
      throw new Error("Failed to create tunnel");
    }
  },
};
