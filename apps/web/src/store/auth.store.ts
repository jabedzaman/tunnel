import { IUser } from "@tunnel/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthStoreState {
  user: IUser | null;
  accessToken?: string;
  isAuthenticated: boolean;
}

interface IAuthStoreActions {
  setUser: (user: IUser | null) => void;
  setAccessToken: (accessToken: string | undefined) => void;
  logout: () => void;
  initialize: () => void;
}

export type AuthStore = IAuthStoreState & IAuthStoreActions;

/**
 * Auth store for managing user authentication state.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: IUser | null) => set({ user, isAuthenticated: !!user }),

      accessToken: undefined,
      setAccessToken: (accessToken: string | undefined) => set({ accessToken }),

      logout: () => {
        set({
          user: null,
          accessToken: undefined,
          isAuthenticated: false,
        });
      },

      initialize: () => {
        const { user } = get();
        set({ isAuthenticated: !!user });
      },
    }),

    {
      name: "auth-store",
      // dont persist the accessToken in local storage
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.initialize();
      },
    }
  )
);
