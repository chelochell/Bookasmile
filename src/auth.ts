import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { env } from "@/env";
import { admin } from "better-auth/plugins";
import { ac, patient, dentist, secretary, user, super_admin } from "./lib/permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    "http://localhost:3000",
    env.BETTER_AUTH_URL,
  ],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      defaultRole: "user",
      roles: {
        user: user,
        patient: patient,
        dentist: dentist,
        secretary: secretary,
        super_admin: super_admin,
      }
    })
  ]
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};