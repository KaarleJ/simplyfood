import handler from '../like';
import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth/next';
import prisma from '@/prismaClient';

// We mock the getServersession function
jest.mock('next-auth/next');

const mockedGetSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe('/api/like without session', () => {
  test('POST', async () => {
    // We mock the getSession function to return null. We use this in the first test
    mockedGetSession.mockResolvedValue(null);
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Unauthorized' });
  });
});

describe('/api/like', () => {
  let recipeId: number;
  beforeAll(async () => {
    // We connect to the database and clear the recipes table before each test
    await prisma.$connect();
    await prisma.recipe.deleteMany();
    await prisma.user.deleteMany();
    // After the initial test, we mock the getSession function to return a session object
    mockedGetSession.mockResolvedValue({
      expires: '1',
      user: {
        email: 'test@example.com',
        name: 'Test User',
        image: 'test-image',
        id: '1'
      },
    });
    // We create a user and a recipe in the database
    await prisma.user.create({
      data: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'test-image',
      },
    });
    const recipe = await prisma.recipe.create({
      data: {
        title: 'TestRecipe',
        description: 'recipe fo rtesting',
        duration: 20,
        guide: 'test guide',
        ingredients: ['test ingredient'],
        equipment: ['test equipment'],
        imgUrl: 'test/url',
        authorId: 1,
      },
    });
    recipeId = recipe.id;
  });

  // Here we test the POST request to the API
  test('POST', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        recipeId,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Recipe liked' });

    // We check that the like is created in the database
    const user = await prisma.user.findUnique({
      where: {
        id: 1,
      },
      include: {
        likedRecipes: true,
      },
    });
    expect(user?.likedRecipes.length).toBe(1);
    expect(user?.likedRecipes[0].id).toBe(recipeId);

  });

  // Here we test the PUT request to the API
  test('PUT', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      body: {
        recipeId,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Recipe unliked' });

    // We check that the like is deleted in the database
    const user = await prisma.user.findUnique({
      where: {
        id: 1,
      },
      include: {
        likedRecipes: true,
      },
    });
    expect(user?.likedRecipes.length).toBe(0);
  });


  afterAll(async () => {
    await prisma.$disconnect();
  });
});
