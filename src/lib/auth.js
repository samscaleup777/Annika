import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Vercel has MONGODB_URI configured; keep compatibility with MONGODB_URL.
const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
if (!mongoUrl) {
  throw new Error("Missing MongoDB connection string. Set MONGODB_URI in Vercel Environment Variables.");
}

const client = new MongoClient(mongoUrl);
const db = client.db("my-7-assigment");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, { client }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
