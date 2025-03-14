import { defineStore } from "pinia";
import type { User } from "@prisma/client";

export const useUserDataStore = defineStore("userDataStore", {
  state: () => ({
    user: {} as User,
  }),
  actions: {
    setUser(newUser: User) {
      this.user = newUser;
    },
    updateUser(updatedUser: User) {
      this.user = { ...this.user, ...updatedUser };
    },
  },
});
