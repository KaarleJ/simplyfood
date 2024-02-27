import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';

describe('GET /api/recipes', () => {

  test('should return recipes', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.recipes).toHaveLength(2);
        expect(body.count).toBe(2);
      },
    });
  });
});
