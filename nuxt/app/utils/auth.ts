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
      // Debug logs
      console.log("Reset password url:", url.url);
      console.log("User:", url.user.email);

      if (url?.user || url?.url) {
        sendMail({
          subject: "Reset Password",
          text: `Click here to reset your password: ${url.url}`,
          to: url.user?.email,
        });
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: "Something went wrong, contact support.",
        });
      }
    },
  },
});
