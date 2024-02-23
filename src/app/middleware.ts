import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Session } from 'next-auth';
import { decode } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {

  //Middleware for the like route
  if (req.nextUrl.pathname === '/api/like') {
    // We get the session manually
    const session = await getSessionManually(req);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Check the body
    if (!body.recipeId) {
      return NextResponse.json(
        { success: false, message: 'Missing recipeId in body' },
        { status: 400 }
      );
    }

    // Set the userId and recipeId in cookies
    req.cookies.set('userId', session.user.id);
    req.cookies.set('recipeId', body.recipeId);

    return NextResponse.next();
  }
}

export const config = {
  matcher: '/api/:path*',
};

// NextAuth getServerSession doesn't work in edge environment, so we need to get the session manually
async function getSessionManually(req: NextRequest) {
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
