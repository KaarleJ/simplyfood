import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { prismaMock } from '@/lib/__mocks__/singleton';
import { Recipe } from '@prisma/client';
import { deleteImage } from '@/lib/s3';

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

describe('POST /api/protected/recipe', () => {
  test('Should return 201 if recipe is created', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      test: async ({ fetch }) => {
        prismaMock.recipe.create.mockResolvedValue(recipe);

        const response = await fetch({
          method: 'POST',
          body: JSON.stringify({
            recipe: {
              title: 'Spring Rolls',
              ingredients: ['rice paper'],
              equipment: ['kettle'],
              duration: 120,
              imgUrl: 'imgUrl',
              description: 'description',
              guide: 'guide',
            },
          }),
        });
        expect(response.status).toBe(201);
        const body = await response.json();
        expect(body).toMatchObject({
          id: 1,
          title: 'Spring Rolls',
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

  test('Should return 400 and appropriate message if validation fails', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify({
            recipe: {
              title: 'Spring Rolls',
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

  test('Should call deleteImage on error', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify({
            recipe: {
              title: 'Spring Rolls',
              ingredients: ['rice paper'],
              equipment: ['kettle'],
              duration: 120,
              imgUrl: 'imgUrl',
              description: 'description',
            },
          }),
        });
        expect(response.status).toBe(400);
        expect(prismaMock.recipe.create).not.toHaveBeenCalled();
        expect(prismaMock.recipe.create).toHaveBeenCalledTimes(0);
        expect(deleteImage).toHaveBeenCalledWith('imgUrl');
      },
    });
  });
});
