import { createAuthClient } from "better-auth/vue"; // make sure to import from better-auth/vue

export const authClient = createAuthClient({
  //you can pass client configuration here
});

export const { signIn, signOut, signUp, useSession, forgetPassword, resetPassword } = authClient;
