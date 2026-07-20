import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDB, getClient } from "./db.js";

export const auth = betterAuth({
  database: mongodbAdapter(await getDB(), {
    client: await getClient(),
    usePlural: true,
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 5,
    maxPasswordLength: 128,
  },
  advanced: {
    cookiePrefix: "medinexa",
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
