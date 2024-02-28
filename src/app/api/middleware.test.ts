import { middleware } from '../../middleware';
import { NextRequest } from 'next/server';
import { getSessionManually } from '@/lib/utils';

jest.mock('../../lib/utils', () => {
  return {
    getSessionManually: jest.fn((req: NextRequest) => {
      if (req.cookies.get('next-auth.session-token')) {
        return {
          user: {
            id: '1',
            name: 'test',
            email: 'test@test.com',
          },
        };
      }
    }),
  };
});

describe('public routes', () => {
  test('should return 200 if the route is not protected', async () => {
    const req = new NextRequest('http://localhost:3000/api/public');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });
});

describe('protected routes', () => {
  test('should return 200 if the route is protected and the user is authenticated', async () => {
    const req = new NextRequest('http://localhost:3000/api/protected');
    req.cookies.set('next-auth.session-token', 'token');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  test('should return 401 if the route is protected and the user is not authenticated', async () => {
    const req = new NextRequest('http://localhost:3000/api/protected');
    const res = await middleware(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ success: false, message: 'Unauthorized' });
  });
});

describe('like route', () => {
  test('should return 200 if the route is /api/protected/like and the body contains a recipeId', async () => {
    const req = new NextRequest('http://localhost:3000/api/protected/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipeId: 1 }),
    });
    req.cookies.set('next-auth.session-token', 'token');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  test('should return 400 if the route is /api/protected/like and the body does not contain a recipeId', async () => {
    const req = new NextRequest('http://localhost:3000/api/protected/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    req.cookies.set('next-auth.session-token', 'token');
    const res = await middleware(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ success: false, message: 'Missing recipeId in body' });
  });
});