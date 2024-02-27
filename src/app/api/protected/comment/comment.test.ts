import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { prismaMock } from '@/lib/__mocks__/singleton';
import { Comment } from '@prisma/client';

const comment = {
  body: 'comment body',
  recipeId: '1',
};

describe('POST /api/protected/comment', () => {
  test('should return 200 if comment is valid', async () => {
    prismaMock.comment.create.mockResolvedValue({
      id: 1,
      body: comment.body,
      recipeId: Number(comment.recipeId),
      author: {
        id: '1',
        name: 'name',
        avatarUrl: 'avatarUrl',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Comment & {
      author: {
        id: string;
        name: string;
        avatarUrl: string | null;
      };
    });

    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.cookies.set('userId', '1');
      },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment }),
        });
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.comment).toMatchObject({
          body: comment.body,
          recipeId: Number(comment.recipeId),
          authorId: '1',
          authorName: 'name',
          avatarUrl: 'avatarUrl',
        });
      },
    });
  });
});
