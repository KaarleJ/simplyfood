import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionManually } from './lib/utils';

// NextJs middleware is executed in the edge environment
export async function middleware(req: NextRequest) {
  // We initialize the response
  const res = NextResponse.next();

  // Middleware for the protected routes
  if (req.nextUrl.pathname.startsWith('/api/protected')) {
    // We get the session manually because next-auth doesn't work in edge environment
    const session = await getSessionManually(req);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    res.cookies.set('userId', session.user.id);
  }

  //Middleware for the like route
  if (req.nextUrl.pathname === '/api/protected/like') {

    const body = await req.json();

    // Check the body
    if (!body.recipeId) {
      return NextResponse.json(
        { success: false, message: 'Missing recipeId in body' },
        { status: 400 }
      );
    }

    // Set the recipeId in cookies
    res.cookies.set('recipeId', body.recipeId);
  }

  return res;
}

export const config = {
  matcher: '/api/:path*',
};