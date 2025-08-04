import { CreateTunnelPayload } from "@tunnel/validators";
import { Tunnel } from "~/models";

export const create = async (payload: CreateTunnelPayload) => {
  // 1. create a new tunnel
  const tunnel = await Tunnel.create({
    localPort: payload.localPort,
  });
  // 2. return the tunnel
  return tunnel;
};
