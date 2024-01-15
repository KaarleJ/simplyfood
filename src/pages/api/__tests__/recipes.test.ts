import handler from '../recipes';
import authorHandler from '../recipes/[authorId]';
import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';
import { Recipe } from '@/types';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe('/api/recipes', () => {
  let authorId: string;
  beforeAll(async () => {
    // We connect to the database and create a user and two recipes
    await prisma.$connect();
    const { id } = await prisma.user.create({
      data: {
        email: 'tester@test.com',
        name: 'Tester',
        avatarUrl: 'test-image',
      },
    });
    authorId = id;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await prisma.recipe.create({
      data: {
        title: 'Spring rolls',
        description: 'A delicious spring roll recipe',
        duration: 20,
        guide: 'This and that',
        ingredients: ['1 egg', '1 cup of flour'],
        equipment: ['1 bowl', '1 pan'],
        imgUrl: 'https://images.com/photo-23124124512414',
        authorId,
      },
    });
    await prisma.recipe.create({
      data: {
        title: 'Pizza',
        description: 'A delicious pizza recipe',
        duration: 40,
        guide: 'This and that',
        ingredients: ['1 egg', '1 cup of flour'],
        equipment: ['1 bowl', '1 pan'],
        imgUrl: 'https://images.com/photo-23124124512414',
        authorId,
      },
    });
  });

  test('GET', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { recipes }: { recipes: Recipe[]; count: number } = JSON.parse(
      res._getData()
    );
    // We filter out recipes created in parallel tests. And we map them to titles.
    const rec = recipes
      .filter((recipe) => recipe.authorId === authorId)
      .map((recipe) => recipe.title);

    expect(rec.length).toBe(2);
    expect(rec).toContain('Spring rolls');
    expect(rec).toContain('Pizza');
  });

  test('GET with searchQuery', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        search: 'spring',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { recipes, count } = JSON.parse(res._getData());
    expect(recipes.length).toBe(1);
    expect(count).toBe(1);
    expect(recipes[0].title).toBe('Spring rolls');
  });
});

describe('/api/recipes/[authorId]', () => {
  let authorId: string;
  beforeAll(async () => {
    // We connect to the database and create a user and two recipes
    await prisma.$connect();
    const { id } = await prisma.user.create({
      data: {
        email: 'tester2@test2.com',
        name: 'Tester2',
        avatarUrl: 'test-image-2',
      },
    });
    authorId = id;
    await prisma.recipe.create({
      data: {
        title: 'Chicken Nuggets',
        description: 'dino nuggies',
        duration: 20,
        guide: 'This and that',
        ingredients: ['1 egg', '1 cup of flour', '1 cup of chicken'],
        equipment: ['1 bowl', '1 pan'],
        imgUrl: 'https://images.com/photo-23124124512414',
        authorId,
      },
    });
    await prisma.recipe.create({
      data: {
        title: 'pancakes',
        description: 'a delicious pancake recipe',
        duration: 40,
        guide: 'This and that',
        ingredients: ['1 egg', '1 cup of flour'],
        equipment: ['1 bowl', '1 pan'],
        imgUrl: 'https://images.com/photo-23124124512414',
        authorId,
      },
    });
  });

  test('GET with authorId', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        authorId,
      },
    });

    await authorHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { recipes }: { recipes: Recipe[] } = JSON.parse(res._getData());
    // We filter out recipes created in parallel tests. And we map them to titles.

    expect(recipes.length).toBe(2);
    expect(recipes[0].title).toBe('Chicken Nuggets');
    expect(recipes[1].title).toBe('pancakes');
  });
});
