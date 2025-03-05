import { authClient } from "~/utils/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = await authClient.useSession(useFetch);

  if (!session.data.value) {
    if (to.path === "/dashboard") {
      return navigateTo("/");
    }
  }
});
