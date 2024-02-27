import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from '../prismaClient';

const recipes = [
  {
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
  },
  {
    likeCount: 0,
    id: 2,
    authorId: '1',
    title: 'Pasta Carbonara',
    ingredients: ['spaghetti'],
    equipment: ['pot'],
    duration: 30,
    imgUrl: 'imgUrl',
    description: 'description',
    guide: 'guide',
  },
];

jest.mock('../prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
  getRecipes: jest.fn(() => Promise.resolve({ recipes, count: 2 })),
  getRecipeById: jest.fn((id: number) =>
    Promise.resolve({
      recipe: recipes.find((recipe) => recipe.id === id),
      liked: false,
    })
  ),
}));

beforeEach(() => {
  mockReset(prisma);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
