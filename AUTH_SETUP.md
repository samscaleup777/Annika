# Authentication Setup (Better Auth)

This project uses Better Auth for email/password authentication and Google/GitHub OAuth.

## Required Vercel environment variables

Open **Vercel → Annika → Settings → Environment Variables**:
https://vercel.com/hk777/annika/settings/environment-variables

Set these variables for Production. Add them to Preview/Development too if you use those environments.

| Variable | Required | Value |
|---|---|---|
| `BETTER_AUTH_SECRET` | Yes | A long random secret. It is already configured in the current Vercel project; do not replace it without a reason. |
| `BETTER_AUTH_URL` | Yes | `https://annika-hk777.vercel.app` (already configured). |
| `MONGODB_URI` | Yes | The real MongoDB Atlas connection string for this application. |
| `GOOGLE_CLIENT_ID` | For Google | Client ID from a Google OAuth Web application. |
| `GOOGLE_CLIENT_SECRET` | For Google | Client secret from that Google OAuth application. |
| `GITHUB_CLIENT_ID` | For GitHub | Client ID from a GitHub OAuth App. |
| `GITHUB_CLIENT_SECRET` | For GitHub | Client secret from that GitHub OAuth App. |

Never put real credentials in this file, in source code, or in Git commits. Use Vercel's encrypted environment variables for deployed environments.

## 1. Configure MongoDB Atlas

1. Open https://cloud.mongodb.com/ and create/select a project.
2. Create a free MongoDB cluster if you don't already have one.
3. Under **Database Access**, create a database user and store its password securely.
4. Under **Network Access**, allow the Vercel application's outbound connection. Use the narrowest network access your plan and deployment setup support; if you temporarily allow `0.0.0.0/0` for testing, use a strong, unique database password and tighten the rule for production where possible.
5. Open **Connect → Drivers** and copy the MongoDB connection string.
6. Replace the username, password and cluster host in the copied string with the real values. URL-encode any reserved characters in the password.
7. Add the finished string to Vercel as `MONGODB_URI`.

Better Auth stores user, account and session records in this database. Without a valid connection string, email/password registration and login cannot work.

## 2. Configure Google OAuth

1. Open https://console.cloud.google.com/auth/clients.
2. Select/create the Google Cloud project, configure the OAuth consent screen, then create an OAuth client with type **Web application**.
3. Add this exact **Authorized redirect URI**:

   `https://annika-hk777.vercel.app/api/auth/callback/google`

4. Copy the generated Client ID and Client Secret into Vercel as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

## 3. Configure GitHub OAuth

1. Open https://github.com/settings/developers and choose **OAuth Apps → New OAuth App**.
2. Set the Homepage URL to:

   `https://annika-hk777.vercel.app`

3. Set the Authorization callback URL to:

   `https://annika-hk777.vercel.app/api/auth/callback/github`

4. Register the app, generate a client secret, and add the Client ID/Secret to Vercel as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

## 4. Redeploy and verify

After saving environment variables, open https://vercel.com/hk777/annika and redeploy the latest Production deployment so the new variables are available to the running application.

Open this diagnostic endpoint:

https://annika-hk777.vercel.app/api/auth/providers

Expected after setup:

- `databaseConfigured: true`
- `secretConfigured: true`
- `google.configured: true`
- `github.configured: true`
- `missingRequired: []`
- `missingOAuthCredentials: []`

Then test:
- Email sign-up creates the account and redirects to `/signin`.
- Email sign-in succeeds and routes to `/` (home).
- Google and GitHub sign-in/sign-up return to home with a toast.
- Sign-out displays success/error toast and returns to home.
- Empty/invalid email and short password inputs display validation toasts.

## Assignment-specific behavior

- Email verification is intentionally disabled.
- Password reset/forgot-password is intentionally not implemented.
- Email/password sign-up does not automatically sign the user in; it redirects to the sign-in page.
- The application has authentication skeleton loaders and toast notifications for login, registration, social auth and sign-out.
