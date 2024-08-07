// app/api/auth/[...nextauth]/options.ts
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { env } from "@/lib/env"

const adminEmails = ['aminofab@gmail.com', 'aminofabian@gmail.com'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.isAdmin = adminEmails.includes(user.email ?? '');
      }
      return session;
    },
  },
}