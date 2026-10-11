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
    requireEmailVerification: false,
  };
}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    requireEmailVerification: false,
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
    // Match the assignment: no email verification and no automatic sign-in after registration.
    requireEmailVerification: false,
    autoSignIn: false,
  },
  database: mongodbAdapter(db, { client }),
  socialProviders,
});
