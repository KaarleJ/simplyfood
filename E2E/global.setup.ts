import { test as setup } from '@playwright/test';
import prisma from '@/prismaClient';
import { seedDatabase } from '@/seed';

setup('do login', async () => {
  console.log('Global setup:');
  // Clear the database
  console.log('Clearing the database');
  await prisma.comment.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  // Populate the database
  console.log('Populating the database');
  await seedDatabase();
});