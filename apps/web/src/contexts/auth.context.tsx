"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { api } from "~/api";
import { useAuthStore } from "~/store";

interface IAuthContext {
  isLoading: boolean;
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoading: true,
});

export const AuthProvider = ({
  children,
  useAuth = true,
}: {
  children: React.ReactNode;
  useAuth: boolean;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.user.getUser({ logout: useAuth }),
    // avoid refetching on mount/focus if auth is not required
    refetchOnMount: useAuth,
    refetchOnWindowFocus: useAuth,
    refetchOnReconnect: useAuth,
    retry: useAuth,
  });
  const { setUser } = useAuthStore();

  React.useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  const memoized = React.useMemo(
    () => ({
      isLoading,
    }),
    [isLoading]
  );

  return (
    <AuthContext.Provider value={memoized}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
