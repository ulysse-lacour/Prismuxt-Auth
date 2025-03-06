import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();
const { sendMail } = useNodeMailer();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(url, user) {
      if (url?.user && url?.url) {
        try {
          sendMail({
            subject: "Reset Password",
            text: `Click here to reset your password: ${url.url}`,
            to: url.user?.email,
          });
        } catch (error) {
          console.error("Failed to send reset password email:", error);
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to send reset password email.",
          });
        }
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: "Something went wrong, contact support.",
        });
      }
    },
  },
});
