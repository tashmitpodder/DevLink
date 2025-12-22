import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zustand store for authentication
export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      // ✅ login action
      login: (token, user) => {
        set({
          token,
          user,
          loading: false,
        });
      },

      // ✅ logout action
      logout: () => {
        set({
          user: null,
          token: null,
          loading: false,
        });
      },
    }),
    {
      name: "devlink-auth",
    }
  )
);
