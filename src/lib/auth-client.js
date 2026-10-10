import { createAuthClient } from "better-auth/react";

// Use the current site origin so auth cookies stay on the same Vercel host.
export const authClient = createAuthClient();
