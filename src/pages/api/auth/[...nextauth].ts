import NextAuth, { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaClient } from '@prisma/client';
import { Sys } from 'styled-icons/crypto';
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
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
      const id = Number(user.id);

      let prismaUser = await prisma.user.findUnique({ where: { id } });

      if (!prismaUser) {
        const dbUser = {
          id: Number(user.id),
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

export default NextAuth(authOptions);
