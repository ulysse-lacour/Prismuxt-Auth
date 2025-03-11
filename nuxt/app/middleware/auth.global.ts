import { authClient } from "~/utils/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value) {
    // Allow access to authentication-related pages
    const publicPages = [
      "/",
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/forget-password",
      "/auth/reset-password",
    ];
    if (!publicPages.includes(to.path)) {
      return navigateTo("/auth/sign-in");
    }
  }
});
