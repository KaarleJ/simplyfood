import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { prismaMock } from '@/lib/__mocks__/singleton';
import { User, Recipe } from '@prisma/client';

const recipe: Recipe = {
  id: 1,
  authorId: '1',
  title: 'Spring Rolls',
  ingredients: ['rice paper'],
  equipment: ['kettle'],
  duration: 120,
  imgUrl: 'imgUrl',
  description: 'description',
  guide: 'guide',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user: User & {
  likedRecipes: Recipe[];
} = {
  id: '1',
  email: 'tester@example.com',
  name: 'Tester',
  avatarUrl: 'avatarUrl',
  createdAt: new Date(),
  updatedAt: new Date(),
  likedRecipes: [],
};

describe('POST /api/protected/like', () => {
  test('should return 200 if recipe is liked', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
        request.cookies.set('recipeId', '1');
      },
      params: { recipeId: '2' },
      test: async ({ fetch }) => {
        prismaMock.user.findUnique.mockResolvedValue(user);
        prismaMock.user.update.mockResolvedValue(user);

        const response = await fetch({
          method: 'POST',
        });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body).toMatchObject({ message: 'Recipe liked' });
      },
    });
  });

  test('should return 400 if recipe is already liked', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
        request.cookies.set('recipeId', '1');
      },
      params: { recipeId: '2' },
      test: async ({ fetch }) => {
        user.likedRecipes = [recipe];
        prismaMock.user.findUnique.mockResolvedValue(user);

        const response = await fetch({
          method: 'POST',
        });
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body).toMatchObject({ message: 'Recipe already liked' });
      },
    });
  });
});


describe('PUT /api/protected/like', () => {
  test('should return 200 if recipe is unliked', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
        request.cookies.set('recipeId', '1');
      },
      params: { recipeId: '2' },
      test: async ({ fetch }) => {
        user.likedRecipes = [recipe];
        prismaMock.user.findUnique.mockResolvedValue(user);
        prismaMock.user.update.mockResolvedValue(user);

        const response = await fetch({
          method: 'PUT',
        });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body).toMatchObject({ message: 'Recipe unliked' });
      },
    });
  });

  test('should return 400 if recipe is not liked', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
        request.cookies.set('recipeId', '1');
      },
      params: { recipeId: '2' },
      test: async ({ fetch }) => {
        user.likedRecipes = [];
        prismaMock.user.findUnique.mockResolvedValue(user);

        const response = await fetch({
          method: 'PUT',
        });
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body).toMatchObject({ message: 'Recipe not liked' });
      },
    });
  });
});