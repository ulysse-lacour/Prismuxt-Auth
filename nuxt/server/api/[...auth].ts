import { auth } from "~/utils/auth";

/**
 * Authentication API handler
 *
 * This is a catch-all route that handles all authentication-related requests.
 * It delegates to the auth handler from the auth utils, which processes:
 * - Sign in
 * - Sign up
 * - Sign out
 * - Password reset
 * - Email verification
 * - Session management
 *
 * The route pattern [...auth] captures all paths under /api/auth/*
 */
export default defineEventHandler((event) => {
  // Convert the Nitro event to a web request that the auth handler can process
  return auth.handler(toWebRequest(event));
});
