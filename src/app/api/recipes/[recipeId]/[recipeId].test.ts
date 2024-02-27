import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';

describe('GET /api/recipes/[recipeId]', () => {
  test('should return a recipe', async () => {
    await testApiHandler({
      appHandler,
      params: { recipeId: '1' },
      async test({ fetch }) {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.recipe).toEqual({
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
        });
      },
    });
  });
});
