import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { prismaMock } from '@/lib/__mocks__/singleton';
import { Recipe } from '@prisma/client';
import { deleteImage } from '@/lib/s3';

const recipe: Recipe = {
  title: 'Spring Rolls',
  ingredients: ['rice paper'],
  equipment: ['kettle'],
  duration: 120,
  imgUrl: 'imgUrl',
  description: 'description',
  guide: 'guide',
  authorId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  id: 1,
};


describe('PUT /api/protected/recipe/[recipeId]', () => {
  test('should return 200 if recipe is updated', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        prismaMock.recipe.update.mockResolvedValue({ ...recipe, title: 'New Title' });

        const response = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            recipe: {
              title: 'New Title',
              ingredients: ['rice paper'],
              equipment: ['kettle'],
              duration: 120,
              imgUrl: 'imgUrl',
              description: 'description',
              guide: 'guide',
            },
          }),
        });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.updatedRecipe).toMatchObject({
          id: 1,
          title: 'New Title',
          ingredients: ['rice paper'],
          equipment: ['kettle'],
          duration: 120,
          imgUrl: 'imgUrl',
          description: 'description',
          guide: 'guide',
        });
      },
    });
  });

  test('should return 400 if recipe id is missing', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            recipe: {
              title: 'New Title',
              ingredients: ['rice paper'],
              equipment: ['kettle'],
              duration: 120,
              imgUrl: 'imgUrl',
              description: 'description',
              guide: 'guide',
            },
          }),
        });
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Missing recipe id' });
      },
    });
  });

  test('should return 400 if missing recipe in body', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          body: JSON.stringify({}),
        });
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Missing recipe in body' });
      },
    });
  });

  test('should return 400 if validation fails', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            recipe: {
              title: 'New Title',
              ingredients: ['rice paper'],
              equipment: ['kettle'],
              duration: 120,
              imgUrl: 'imgUrl',
              description: 'description',
            },
          }),
        });
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Instructions are required' });
      },
    });
  });

  test('should return 404 if recipe not found', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '3' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            recipe: {
              title: 'New Title',
              ingredients: ['rice paper'],
              equipment: ['kettle'],
              duration: 120,
              imgUrl: 'imgUrl',
              description: 'description',
              guide: 'guide',
            },
          }),
        });
        expect(response.status).toBe(404);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Recipe not found' });
      },
    });
  });

  test('should return 403 if user is not the author of the recipe', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '2');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            recipe: {
              title: 'New Title',
              ingredients: ['rice paper'],
              equipment: ['kettle'],
              duration: 120,
              imgUrl: 'imgUrl',
              description: 'description',
              guide: 'guide',
            },
          }),
        });
        expect(response.status).toBe(403);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'You are not the author of this recipe' });
      },
    });
  });
});

describe('DELETE /api/protected/recipe/[recipeId]', () => {
  test('should return 200 if recipe is deleted', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        prismaMock.recipe.delete.mockResolvedValue(recipe);

        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body).toMatchObject({ message: 'Recipe deleted' });
      },
    });
  });

  test('should call the deleteImage function', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        prismaMock.recipe.delete.mockResolvedValue(recipe);

        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(200);
        expect(deleteImage).toHaveBeenCalledWith('imgUrl');
      },
    });
  });

  test('should return 400 if recipe id is missing', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Missing recipe id' });
      },
    });
  });

  test('should return 404 if recipe not found', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '3' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(404);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Recipe not found' });
      },
    });
  });

  test('should return 403 if user is not the author of the recipe', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '2');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(403);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Forbidden' });
      },
    });
  });
});