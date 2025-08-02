import { useAuthStore } from "./auth.store";

// export the stores
export * from "./auth.store";

export const clearStore = () => {
  const { setUser, setAccessToken } = useAuthStore.getState();
  setUser(null);
  setAccessToken(undefined);
};
