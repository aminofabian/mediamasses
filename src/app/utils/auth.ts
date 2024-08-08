// utils/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.isAdmin ?? false;
}