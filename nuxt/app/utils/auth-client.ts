/**
 * Authentication Client Utility
 *
 * This file sets up the client-side authentication utilities using better-auth.
 * It creates and exports an auth client instance and destructured authentication functions
 * that can be used throughout the application for user authentication.
 */
import { createAuthClient } from "better-auth/vue"; // Import from better-auth/vue for Vue integration

/**
 * Create the authentication client instance
 * Configuration options can be passed here if needed
 */
export const authClient = createAuthClient({
  // Client configuration options can be added here
});

/**
 * Export individual authentication functions for use in components and composables:
 * - signIn: Authenticate a user with credentials
 * - signOut: End the current user session
 * - signUp: Register a new user
 * - useSession: Get the current authentication session
 * - forgetPassword: Initiate password recovery process
 * - resetPassword: Complete password reset with token
 */
export const { signIn, signOut, signUp, useSession, forgetPassword, resetPassword } = authClient;
