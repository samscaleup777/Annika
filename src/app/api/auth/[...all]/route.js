import { toNextJsHandler } from "better-auth/next-js";

// Initialize Better Auth at request time so missing deployment-only secrets or
// database URLs do not crash Next.js while collecting build-time route config.
async function getAuthHandler(method) {
  const { auth } = await import("@/lib/auth");
  const handlers = toNextJsHandler(auth);
  return handlers[method];
}

export async function GET(request, context) {
  const handler = await getAuthHandler("GET");
  return handler(request, context);
}

export async function POST(request, context) {
  const handler = await getAuthHandler("POST");
  return handler(request, context);
}
