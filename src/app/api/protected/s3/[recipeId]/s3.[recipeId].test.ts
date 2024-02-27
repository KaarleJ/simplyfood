import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { prismaMock } from '@/lib/__mocks__/singleton';

const rec = {
  createdAt: new Date(),
  updatedAt: new Date(),
  likeCount: 0,
  id: 1,
  authorId: '1',
  title: 'Spring Rolls',
  ingredients: ['rice paper'],
  equipment: ['kettle'],
  duration: 120,
  imgUrl: 'imgUrl',
  description: 'description',
  guide: 'guide',
};

describe('GET /api/protected/s3/[recipeId]', () => {
  test('should call the delete function', async () => {
    prismaMock.recipe.findUnique.mockResolvedValue(rec);

    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'DELETE' });
        expect(response.status).toBe(200);
      },
    });
  });

  test('should return 404 if recipe not found', async () => {
    prismaMock.recipe.findUnique.mockResolvedValue(null);

    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'DELETE' });
        expect(response.status).toBe(404);
      },
    });
  });

  test('should return 401 if user is not authorized', async () => {
    prismaMock.recipe.findUnique.mockResolvedValue(rec);

    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '2');
      },
      params: { recipeId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'DELETE' });
        expect(response.status).toBe(401);
      },
    });
  });
});
