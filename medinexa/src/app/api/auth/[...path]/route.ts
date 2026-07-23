import { NextResponse } from "next/server";
import { getAuth } from "@/lib/server/auth";
import { rateLimit, getRateLimitHeaders, getClientIp } from "@/lib/server/rate-limit";

async function handle(request: Request) {
  try {
    const auth = await getAuth();
    return await auth.handler(request);
  } catch (err) {
    console.error("[AUTH ERROR]", err);
    return NextResponse.json(
      { message: "Internal server error", error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) { return handle(request); }

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const url = new URL(request.url);
  const isAuthAction = url.pathname.includes("/sign-in") || url.pathname.includes("/sign-up");

  if (isAuthAction) {
    const result = rateLimit(`auth:${ip}`, 10, 60_000);
    if (!result.allowed) {
      return NextResponse.json(
        { message: "Too many attempts. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(result, 10) }
      );
    }
  }

  return handle(request);
}

export async function PUT(request: Request) { return handle(request); }
export async function PATCH(request: Request) { return handle(request); }
export async function DELETE(request: Request) { return handle(request); }
export async function OPTIONS(request: Request) { return handle(request); }
