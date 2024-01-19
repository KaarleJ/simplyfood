import SearchBar from '@/components/SearchBar';
import Text from '@/components/Text';
import PageBar from '@/components/PageBar';
import Loader from '@/components/Loader';
import useRecipes from '@/hooks/useRecipes';
import RecipeCard from '@/components/RecipeCard';

const Recipes = () => {
  const { recipes, loading, error, count, page, query, setQuery } =
    useRecipes();

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Text>{error}</Text>
      </div>
    );
  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col min-h-loose justify-between">
      <div>
        <SearchBar
          className="flex flex-row items-center justify-between m-4 text-stone-600"
          query={query}
          setQuery={setQuery}
        />

        <Text className="text-md ml-4 flex justify-center mr-5">
          Page {page} of {Math.ceil(count / 18)}
        </Text>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 m-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      <PageBar
        search={query}
        pages={Math.ceil(count / 18)}
        currentPage={page}
      />
    </div>
  );
};

export default Recipes;
