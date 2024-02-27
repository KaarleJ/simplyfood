import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prismaClient';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user }) {
      let prismaUser = await prisma.user.findUnique({ where: { id: user.id } });

      if (!prismaUser) {
        const dbUser = {
          id: user.id,
          name: user.name as string,
          email: user.email as string,
          avatarUrl: user.image as string,
        };
        prismaUser = await prisma.user.create({ data: dbUser });
      }


      return true;
    },
  },
};