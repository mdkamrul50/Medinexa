import type { Auth } from "better-auth";
import type { AuthSession } from "@/types";

let _auth: Auth | null = null;
let _promise: Promise<Auth> | null = null;

export async function getAuth(): Promise<Auth> {
  if (_auth) return _auth as Auth;
  if (!_promise) {
    const required = ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "MONGODB_URI"] as const;
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
    _promise = (async () => {
      const { betterAuth } = await import("better-auth");
      const { mongodbAdapter } = await import("better-auth/adapters/mongodb");
      const { getDB, getClient } = await import("./db");

      const db = await getDB();
      const client = await getClient();

      _auth = betterAuth({
        database: mongodbAdapter(db, { client, usePlural: true }),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
        emailAndPassword: {
          enabled: true,
          autoSignIn: true,
          minPasswordLength: 5,
          maxPasswordLength: 128,
        },
        user: {
          additionalFields: {
            role: {
              type: "string",
              required: true,
              defaultValue: "patient",
              input: false,
            },
            phone: {
              type: "string",
              required: false,
              defaultValue: "",
              input: true,
            },
            address: {
              type: "string",
              required: false,
              defaultValue: "",
              input: true,
            },
          },
        },
        advanced: {
          cookiePrefix: "medinexa",
          defaultCookieAttributes: {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          },
        },
      }) as unknown as Auth;

      return _auth as Auth;
    })();
  }
  return _promise;
}

export async function getSession(headers: Headers): Promise<AuthSession | null> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers });
  return session as AuthSession | null;
}
