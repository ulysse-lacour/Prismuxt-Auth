import { defineStore } from "pinia";
import type { User } from "@prisma/client";

/**
 * User Data Store
 *
 * Manages the current user's data throughout the application.
 * This store is used to maintain user information after authentication
 * and to update user data when changes are made to the profile.
 */
export const useUserDataStore = defineStore("userDataStore", {
  state: () => ({
    user: {} as User, // Current user data
  }),
  actions: {
    /**
     * Sets the complete user object
     * Used primarily after login or initial data fetch
     *
     * @param newUser - Complete user object to set
     */
    setUser(newUser: User) {
      this.user = newUser;
    },

    /**
     * Updates specific properties of the user object
     * Used when partial updates are made to user data
     *
     * @param updatedUser - Partial user object with properties to update
     */
    updateUser(updatedUser: User) {
      this.user = { ...this.user, ...updatedUser };
    },
  },
});
