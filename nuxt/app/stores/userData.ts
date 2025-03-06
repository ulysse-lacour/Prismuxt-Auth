import { defineStore } from "pinia";
import type { User } from "@prisma/client";

export const useUserDataStore = defineStore("userDataStore", {
  state: () => ({
    user: {} as User,
  }),
  actions: {
    setUser(newUser) {
      this.user = newUser;
    },
    updateUser(updatedUser) {
      console.log(updatedUser);
      this.user = { ...this.user, ...updatedUser };
    },
  },
});
