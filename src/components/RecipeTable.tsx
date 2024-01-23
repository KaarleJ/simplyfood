import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import Text from './Text';

const StaticRecipeTable = ({ recipes }: { recipes: Recipe[] }) => {
  if (recipes.length === 0) {
    return (
      <div
        className='bg-gray-50 border rounded-md m-5 h-48 min-w-xl flex justify-center items-center'
      >
        <Text>No recipes</Text>
      </div>
    );
  }
  return (
    <div className="m-5 grid bg-gray-50 border rounded-md overflow-x-auto">
      <div className="overflow-x-auto py-2">
        <div className="flex flex-row items-stretch justify-start w-max">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} className="mx-5 w-48" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaticRecipeTable;
