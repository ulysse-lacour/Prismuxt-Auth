import { authClient } from "~/utils/auth-client";

/**
 * Global Authentication Middleware
 *
 * This middleware runs on every route change and enforces authentication rules:
 * - Checks if the user is authenticated by verifying their session
 * - Allows unauthenticated access to public pages (home, auth pages)
 * - Redirects unauthenticated users to the sign-in page for protected routes
 *
 * The .global suffix in the filename ensures this middleware runs on every route.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Get the current user session using the auth client
  const { data: session } = await authClient.useSession(useFetch);

  // If user is not authenticated
  if (!session.value) {
    // List of pages that don't require authentication
    const publicPages = [
      "/", // Home page
      "/auth/sign-in", // Sign in page
      "/auth/sign-up", // Sign up page
      "/auth/forget-password", // Password recovery request page
      "/auth/reset-password", // Password reset page
    ];

    // Redirect to sign-in page if trying to access a protected route
    if (!publicPages.includes(to.path)) {
      return navigateTo("/auth/sign-in");
    }
  }
});
