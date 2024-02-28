import { Session } from 'next-auth';
import { decode } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// NextAuth getServerSession doesn't work in edge environment, so we need to get the session manually
export async function getSessionManually(req: NextRequest) {
  const cookie = req.cookies.get('next-auth.session-token');
  if (!cookie) {
    return null;
  }
  const token = cookie.value;
  const secret = process.env.NEXTAUTH_SECRET as string;
  const decoded = await decode({
    token,
    secret,
  });

  if (!decoded) {
    return null;
  }

  const session: Session = {
    user: {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      image: decoded.picture,
    },
    expires: decoded.exp as string,
  };

  return session;
}