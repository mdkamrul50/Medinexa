import { getAuth } from "@/lib/server/auth";

async function handle(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export async function GET(request: Request) { return handle(request); }
export async function POST(request: Request) { return handle(request); }
export async function PUT(request: Request) { return handle(request); }
export async function PATCH(request: Request) { return handle(request); }
export async function DELETE(request: Request) { return handle(request); }
export async function OPTIONS(request: Request) { return handle(request); }
