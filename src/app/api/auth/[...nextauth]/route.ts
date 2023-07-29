import { authOptions } from "@/lib/auth-options";
import nextAuth from "next-auth";

const authHandler: unknown = nextAuth(authOptions);

// required for app router
export { authHandler as GET, authHandler as POST };
