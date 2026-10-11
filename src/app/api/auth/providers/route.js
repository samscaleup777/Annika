export const dynamic = "force-dynamic";

export async function GET() {
  const databaseConfigured = Boolean(process.env.MONGODB_URI || process.env.MONGODB_URL);
  const secretConfigured = Boolean(process.env.BETTER_AUTH_SECRET);
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const githubConfigured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  const emailVerificationConfigured = Boolean(process.env.RESEND_API_KEY && process.env.AUTH_FROM_EMAIL);

  const missing = [];
  if (!databaseConfigured) missing.push("MONGODB_URI");
  if (!secretConfigured) missing.push("BETTER_AUTH_SECRET");
  if (!googleConfigured) missing.push("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET");
  if (!githubConfigured) missing.push("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET");
  if (!emailVerificationConfigured) missing.push("RESEND_API_KEY", "AUTH_FROM_EMAIL");

  return Response.json({
    databaseConfigured,
    secretConfigured,
    emailVerificationConfigured,
    google: { configured: googleConfigured },
    github: { configured: githubConfigured },
    missing,
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
