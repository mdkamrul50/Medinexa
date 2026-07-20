import { headers } from "next/headers";

const AUTH_URL = process.env.AUTH_URL!;

export async function getServerSession() {
  const cookieHeader = (await headers()).get("cookie") ?? "";

  try {
    const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json() as Promise<{
      user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image?: string;
        createdAt: string;
        updatedAt: string;
      };
      session: {
        id: string;
        userId: string;
        expiresAt: string;
        createdAt: string;
        updatedAt: string;
      };
    } | null>;
  } catch {
    return null;
  }
}
