import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// OAuth is enabled only when the matching provider credentials are present in Vercel.
// Keep compatibility with both supported MongoDB connection-string names.
const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
if (!mongoUrl) {
  throw new Error("Missing MongoDB connection string. Set MONGODB_URI in Vercel Environment Variables.");
}

const client = new MongoClient(mongoUrl);
const db = client.db("my-7-assigment");

const socialProviders = {};
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    requireEmailVerification: true,
  };
}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    requireEmailVerification: true,
  };
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://annika-hk777.vercel.app",
  trustedOrigins: [
    "https://annika-hk777.vercel.app",
    "https://annika-three.vercel.app",
    "https://annika-git-main-hk777.vercel.app",
    "https://annika-*.vercel.app",
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: Boolean(process.env.RESEND_API_KEY && process.env.AUTH_FROM_EMAIL),
  },
  emailVerification: {
    // Only require verification when a real email delivery provider is configured.
    // This prevents sign-up from creating an account and then failing at email delivery.
    sendOnSignUp: Boolean(process.env.RESEND_API_KEY && process.env.AUTH_FROM_EMAIL),
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.AUTH_FROM_EMAIL;
      if (!apiKey || !from) {
        throw new Error("Email verification requires RESEND_API_KEY and AUTH_FROM_EMAIL in Vercel.");
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [user.email],
          subject: "Verify your Bazar Dor account",
          text: `Please verify your email address by opening this link: ${url}`,
          html: `<p>Thanks for creating a Bazar Dor account.</p><p><a href="${url}">Verify your email address</a></p><p>If you did not create this account, you can ignore this email.</p>`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Verification email delivery failed with status ${response.status}.`);
      }
    },
  },
  database: mongodbAdapter(db, { client }),
  socialProviders,
});
