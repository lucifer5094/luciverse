import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Sirf import hona chahiye

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };