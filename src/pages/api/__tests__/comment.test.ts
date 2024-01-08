import handler from '../comment/index';
import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

// The use of comment API requires a session, so we mock it
jest.mock('next-auth/next');

const mockedGetSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

// We test the API without a session
describe('/api/comment without session', () => {
  test('GET /api/comment without session', async () => {
    // We mock the getSession function to return an empty object. We use this in the first test
    mockedGetSession.mockResolvedValue(null);
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Unauthorized' });
  });
});

// Test the api routes
describe('/api/comment', () => {
  let recipeId: number;
  let authorId: string;
  beforeAll(async () => {
    // Connect to and clear the db and create user and recipe for comment testing.
    await prisma.$connect();
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'test-image',
      },
    });
    const recipe = await prisma.recipe.create({
      data: {
        title: 'Test Recipe',
        description: 'Test Description',
        duration: 10,
        guide: 'Test Guide',
        ingredients: ['Test Ingredient'],
        equipment: ['Test Equipment'],
        imgUrl: 'Test Image',
        authorId: user.id,
      },
    });

    // We use these variables in the tests
    recipeId = recipe.id;
    authorId = user.id;

    // After the initial test, we mock the getSession function to return a session object
    mockedGetSession.mockResolvedValue({
      expires: '1',
      user: {
        email: 'test@example.com',
        name: 'Test User',
        image: 'test-image',
        id: user.id,
      },
    });
  });

  test('GET method not allowed', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Method not allowed',
    });
  });

  test('POST', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        comment: {
          body: 'Test Comment',
          authorId: authorId,
          recipeId: recipeId,
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const returnedComment = JSON.parse(res._getData()).comment;
    expect(returnedComment.body).toBe('Test Comment');
    expect(returnedComment.authorId).toBe(authorId);
    expect(returnedComment.authorName).toBe('Test User');
    expect(returnedComment.avatarUrl).toBe('test-image');
    expect(returnedComment.recipeId).toBe(recipeId);
    expect(returnedComment.id).toBeDefined();
    expect(returnedComment.createdAt).toBeDefined();
  });
});
