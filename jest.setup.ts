import prisma from '@/prismaClient';


export default async function globalSetup() {
  await prisma.comment.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
}