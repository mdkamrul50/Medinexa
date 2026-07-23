import { headers } from "next/headers";
import { getAuth } from "./server/auth";

export async function getServerSession() {
  try {
    const auth = await getAuth();
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    return session;
  } catch {
    return null;
  }
}
