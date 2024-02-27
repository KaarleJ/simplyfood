import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';


describe('GET /api/protected/s3', () => {
  test('should return a signed url', async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.url).toBe('https://mockedurl.com/signedurl');
      },
    });
  });
});