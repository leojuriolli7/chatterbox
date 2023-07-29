/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { authOptions } from "@/lib/auth-options";
import nextAuth from "next-auth";

const authHandler = nextAuth(authOptions);

// required for app router
export { authHandler as GET, authHandler as POST };
