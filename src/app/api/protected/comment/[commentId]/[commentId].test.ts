import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { prismaMock } from '@/lib/__mocks__/singleton';

const comment = {
  id: 1,
  body: 'comment body',
  recipeId: 1,
  authorId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('DELETE /api/protected/comment/[commentId]', () => {
  test('should return 200 if comment is deleted', async () => {
    prismaMock.comment.findUnique.mockResolvedValue(comment);

    prismaMock.comment.delete.mockResolvedValue(comment);

    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { commentId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body).toMatchObject({ message: 'Comment deleted' });
      },
    });
  });

  test('should return 404 if comment is not found', async () => {
    prismaMock.comment.findUnique.mockResolvedValue(null);

    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { commentId: '3' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(404);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Comment not found' });
      },
    });
  });

  test('should return 401 if user is not the author of the comment', async () => {
    prismaMock.comment.findUnique.mockResolvedValue({
      ...comment,
      authorId: '2',
    });

    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      params: { commentId: '1' },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'DELETE',
        });
        expect(response.status).toBe(401);
        const body = await response.json();
        expect(body).toMatchObject({ error: 'Unauthorized' });
      },
    });
  });
});
