import RecipeCard from './RecipeCard';
import useSWR from 'swr';
import { Recipe } from '@/types';
import Loader from './Loader';
import Text from './Text';

interface ClientRecipeTableProps {
  className?: string;
  apiUrl: string;
}

const ClientRecipeTable = ({ className, apiUrl }: ClientRecipeTableProps) => {
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<{ recipes: Recipe[]}>(apiUrl, (url: string) =>
    fetch(url).then((res) => res.json())
  );

  if (loading) {
    return (
      <div className={`bg-gray-50 border rounded-md h-48 w-full flex justify-center items-center ${className}`}>
        <Loader />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className={`bg-gray-50 border rounded-md h-48 w-full flex justify-center items-center ${className}`}>
        <Text>Failed to load</Text>
      </div>
    );
  }

  if (data.recipes.length === 0) {
    return (
      <div className={`bg-gray-50 border rounded-md h-48 w-full flex justify-center items-center ${className}`}>
        <Text>No recipes</Text>
      </div>
    );
  }
  return (
    <div className={`grid bg-gray-50 border rounded-md overflow-x-auto ${className}`}>
      <div className="overflow-x-auto py-2">
        <div className="flex flex-row items-stretch justify-start w-max">
          {data.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} className="mx-5 w-48" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientRecipeTable;

//{recipes.map((recipe) => (
//  <RecipeCard key={recipe.id} recipe={recipe} className="mx-5 w-48" />
//))}
