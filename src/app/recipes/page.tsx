import { getRecipes } from '@/prismaClient';
import RecipeCard from '@/components/RecipeCard';
import ClientLayout from './ClientLayout';

const Recipes = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const query = searchParams.search as string | undefined;
  const page = searchParams.page as string | undefined;
  const { recipes } = await getRecipes(page, query);
  return (
    <div className="flex flex-col min-h-loose justify-between">
      <ClientLayout>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 m-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </ClientLayout>
    </div>
  );
};

export default Recipes;
