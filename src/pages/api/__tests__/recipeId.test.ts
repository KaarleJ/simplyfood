import handler from '../recipe/[recipeId]';
import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth/next';
import prisma from '@/prismaClient';
import { deleteImage } from '@/s3';

// The use of recipe API requires a session, so we mock it
jest.mock('next-auth/next');

const mockedGetSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

// We mock the deleteImage function
jest.mock('../../../s3');

const mockedDeleteImage = deleteImage as jest.MockedFunction<
  typeof deleteImage
>;

// We test the API without a session
describe('/api/recipe/[recipeId] without recipeId', () => {
  test('GET /api/recipe/[recipeId] without recipeId', async () => {
    // We mock the getSession function to return an empty object. We use this in the first test
    mockedGetSession.mockResolvedValue(null);
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Missing recipe id' });
  });
});

// Here we test the api route
describe('/api/recipe/[recipeId]', () => {
  let recipeId: number;
  let authorId: string;
  beforeAll(async () => {
    // We connect to the database and clear the recipes table before tests
    await prisma.$connect();
    // We create a user and a recipe in the database to test the methods on it
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'test-image',
      },
    });
    const recipe = await prisma.recipe.create({
      data: {
        title: 'Test recipe',
        description: 'Test description',
        duration: 10,
        guide: 'Test guide',
        ingredients: ['Test ingredient'],
        equipment: ['Test equipment'],
        imgUrl: 'test/image/url',
        authorId: user.id,
      },
    });
    // We mock the getSession function to return a session object
    mockedGetSession.mockResolvedValue({
      expires: '1',
      user: {
        email: 'test@example.com',
        name: 'Test User',
        image: 'test-image',
        id: user.id,
      },
    });
    // We use these variables in the tests
    recipeId = recipe.id;
    authorId = user.id;
  });


  test('GET recipe by id', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        recipeId,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { recipe, liked } = JSON.parse(res._getData());
    expect(recipe.title).toBe('Test recipe');
    expect(recipe.description).toBe('Test description');
    expect(recipe.duration).toBe(10);
    expect(recipe.guide).toBe('Test guide');
    expect(recipe.ingredients).toEqual(['Test ingredient']);
    expect(recipe.equipment).toEqual(['Test equipment']);
    expect(recipe.imgUrl).toBe('test/image/url');
    expect(recipe.id).toBeDefined();
    expect(liked).toBe(false);
  });

  test('PUT recipe by id', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        recipeId,
      },
      body: {
        recipe: {
          title: 'Updated recipe',
          description: 'Updated description',
          duration: 20,
          guide: 'Updated guide',
          ingredients: ['Updated ingredient'],
          equipment: ['Updated equipment'],
          imgUrl: 'updated/image/url',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const updatedRecipe = JSON.parse(res._getData());
    expect(updatedRecipe.title).toBe('Updated recipe');
    expect(updatedRecipe.description).toBe('Updated description');
    expect(updatedRecipe.duration).toBe(20);
    expect(updatedRecipe.guide).toBe('Updated guide');
    expect(updatedRecipe.ingredients).toEqual(['Updated ingredient']);
    expect(updatedRecipe.equipment).toEqual(['Updated equipment']);
    expect(updatedRecipe.imgUrl).toBe('updated/image/url');
    expect(updatedRecipe.id).toBeDefined();
  });

  test('DELETE recipe by id', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        recipeId,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const deletedRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    expect(deletedRecipe).toBeNull();
  });
});