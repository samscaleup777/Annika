export const dynamic = "force-dynamic";

export async function GET() {
  const databaseConfigured = Boolean(process.env.MONGODB_URI || process.env.MONGODB_URL);
  const secretConfigured = Boolean(process.env.BETTER_AUTH_SECRET);
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const githubClientIdConfigured = Boolean(process.env.GITHUB_CLIENT_ID?.trim());
  const githubClientSecretConfigured = Boolean(process.env.GITHUB_CLIENT_SECRET?.trim());
  const githubConfigured = githubClientIdConfigured && githubClientSecretConfigured;

  const missingRequired = [];
  const missingOAuthCredentials = [];
  if (!databaseConfigured) missingRequired.push("MONGODB_URI");
  if (!secretConfigured) missingRequired.push("BETTER_AUTH_SECRET");
  if (!googleConfigured) missingOAuthCredentials.push("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET");
  if (!githubClientIdConfigured) missingOAuthCredentials.push("GITHUB_CLIENT_ID");
  if (!githubClientSecretConfigured) missingOAuthCredentials.push("GITHUB_CLIENT_SECRET");

  return Response.json({
    databaseConfigured,
    secretConfigured,
    google: { configured: googleConfigured },
    github: {
      configured: githubConfigured,
      clientIdConfigured: githubClientIdConfigured,
      clientSecretConfigured: githubClientSecretConfigured,
    },
    missingRequired,
    missingOAuthCredentials,
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
