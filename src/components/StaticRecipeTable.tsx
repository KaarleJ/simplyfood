'use client';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';

const StaticRecipeTable = ({ recipes }: { recipes: Recipe[] }) => {
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
