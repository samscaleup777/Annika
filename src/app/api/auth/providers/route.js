export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    databaseConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGODB_URL),
    secretConfigured: Boolean(process.env.BETTER_AUTH_SECRET),
    google: {
      configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      configured: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
