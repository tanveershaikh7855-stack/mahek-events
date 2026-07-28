import { handlers } from "@/lib/auth";

// This file did not exist before, so NextAuth had no endpoint to talk to and
// authentication could never complete regardless of what the UI did.
export const { GET, POST } = handlers;
