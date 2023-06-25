import NextAuth, { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const isProduction = process.env.NODE_ENV === "production"
const baseURL = isProduction ? "http://simplyfood-git-main-kaarlej.vercel.app/" : "http://localhost:3000"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    })
  ],
  callbacks: {
    async redirect({ url }) {
      console.log(baseURL);
      console.log(process.env.NODE_ENV);
      
      return baseURL
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
      }
      return session
    }
  },
}


export default NextAuth(authOptions)