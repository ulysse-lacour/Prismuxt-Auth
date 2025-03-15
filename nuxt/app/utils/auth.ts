import prisma from "~/utils/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

/**
 * Server-side Authentication Configuration
 *
 * This file sets up the server-side authentication system using better-auth.
 * It configures:
 * - Database adapter using Prisma for user storage
 * - Email and password authentication strategy
 * - Password reset functionality with email notifications
 */

// Get the email sending utility from Nuxt's nodemailer module
const { sendMail } = useNodeMailer();

/**
 * Create and configure the authentication handler
 */
export const auth = betterAuth({
  // Configure database adapter using Prisma
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Enable email and password authentication
  emailAndPassword: {
    enabled: true,

    /**
     * Handle password reset email sending
     *
     * This function is called by better-auth when a user requests a password reset.
     * It sends an email with a link to reset their password.
     *
     * @param url - Object containing the reset URL and user information
     * @param user - The user requesting the password reset
     */
    async sendResetPassword(url, user) {
      if (url?.user && url?.url) {
        try {
          // Send password reset email
          sendMail({
            subject: "Reset Password",
            text: `Click here to reset your password: ${url.url}`,
            to: url.user?.email,
          });
        } catch (error) {
          // Handle email sending errors
          console.error("Failed to send reset password email:", error);
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to send reset password email.",
          });
        }
      } else {
        // Handle missing URL or user information
        throw createError({
          statusCode: 500,
          statusMessage: "Something went wrong, contact support.",
        });
      }
    },
  },
});
