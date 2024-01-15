import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { User } from '@/types';
import Text from '@/components/Text';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import Image from 'next/image';
import ClientRecipeTable from '@/components/ClientRecipeTable';

const Profile = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="grid grid-rows-6 m-16 grid-flow-row-dense">
      <div className="col-start-1 col-span-3">
        <Text header className="text-5xl m-5">
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

      <div className='col-start-1 col-span-7 m-5'>
        <Text header>Recipes liked by you</Text>
        <ClientRecipeTable apiUrl={`/api/recipes/${user.id}?liked=true`} className='m-5'/>
      </div>

      <div className='col-start-1 col-span-7 m-5'>
        <Text header>Recipes created by you</Text>
        <ClientRecipeTable apiUrl={`/api/recipes/${user.id}`} className='m-5'/>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps<{
  user: User;
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const user = session?.user as User | undefined;
  if (!session || !user) {
    return {
      notFound: true,
    };
  }
  try {
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
