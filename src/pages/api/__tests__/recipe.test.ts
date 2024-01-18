import handler from '../recipe';
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

// The use of recipe API requires a session, so we mock it
jest.mock('next-auth/next');

const mockedGetSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

// We test the API without a session
describe('/api/recipe without session', () => {
  test('GET /api/recipe without session', async () => {
    // We mock the getSession function to return an empty object. We use this in the first test
    mockedGetSession.mockResolvedValue(null);
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Must be signed in to create a recipe!' });
  });
});


// Here we test the api routes
describe('/api/recipe', () => {
  beforeAll(async () => {
    // We connect to the database and clear the recipes table before tests
    await prisma.$connect();
    // After the initial test, we mock the getSession function to return a session object
    mockedGetSession.mockResolvedValue({
      expires: '1',
      user: {
        email: 'test@example.com',
        name: 'Test User',
        image: 'test-image',
      },
    });
  });

  test('GET method not allowed', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Method not allowed' });
  });

  test('POST', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        recipe: {
          title: 'Test Recipe',
          description: 'Test Description',
          duration: 10,
          guide: 'Test Guide',
          ingredients: ['Test Ingredient'],
          equipment: ['Test Equipment'],
          imgUrl: 'test/image/url',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const returnedRecipe = JSON.parse(res._getData());
    expect(returnedRecipe.title).toBe('Test Recipe');
    expect(returnedRecipe.description).toBe('Test Description');
    expect(returnedRecipe.duration).toBe(10);
    expect(returnedRecipe.guide).toBe('Test Guide');
    expect(returnedRecipe.ingredients).toEqual(['Test Ingredient']);
    expect(returnedRecipe.equipment).toEqual(['Test Equipment']);
    expect(returnedRecipe.imgUrl).toBe('test/image/url');
    expect(returnedRecipe.id).toBeDefined();
  });

  test('POST with empty body', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Missing body' });
  });

  test('POST /api/recipe with faulty body', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        recipe: {
          title: 'Test Recipe',
          description: 'Test Description',
          duration: 10,
          guide: 'Test Guide',
          ingredients: ['Test Ingredient'],
          equipment: ['Test Equipment'],
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'imgUrl is a required field',
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
