import { User } from '@/types';
import Text from '@/components/Text';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Image from 'next/image';
import StaticRecipeTable from '@/components/StaticRecipeTable';
import prisma from '@/prismaClient';

const Profile = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!session || !user) {
    return (
      <div className="flex flex-col justify-center items-center self-center h-screen">
        <Text className="text-3xl">You are not logged in</Text>
      </div>
    );
  }

  const likedRecipes = await prisma.recipe.findMany({
    where: {
      likedBy: {
        some: {
          id: user.id,
        },
      },
    },
  });

  const createdRecipes = await prisma.recipe.findMany({
    where: {
      authorId: user.id,
    },
  });

  return (
    <div className="flex flex-col items-center justify-start sm:grid grid-rows-6 sm:m-16 grid-flow-row-dense">
      <div className="col-start-1 col-span-3">
        <Text header className=" text-4xl sm:text-5xl m-5">
          {user.name}
        </Text>
        <Text className="m-5">{user.email}</Text>
      </div>

      <Image
        src={user.image}
        width={200}
        height={200}
        alt="Profile picture"
        className="col-start-6 col-span-2 row-start-1 rounded-full"
      />

      <div className="col-start-1 col-span-7 m-5">
        <Text header>Recipes liked by you</Text>
        <StaticRecipeTable
          recipes={likedRecipes}
        />
      </div>

      <div className="col-start-1 col-span-7 m-5">
        <Text header>Recipes created by you</Text>
        <StaticRecipeTable recipes={createdRecipes} />
      </div>
    </div>
  );
};

export default Profile;
