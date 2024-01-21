'use client';

import SearchBar from '@/components/SearchBar';
import Text from '@/components/Text';
import PageBar from '@/components/PageBar';
import useRecipes from '@/hooks/useRecipes';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { count, page, query, setQuery } =
    useRecipes();
  return (
    <div>
      <div>
        <SearchBar
          className="flex flex-row items-center justify-between m-4 text-stone-600"
          query={query}
          setQuery={setQuery}
        />

        <Text className="text-md ml-4 flex justify-center mr-5">
          Page {page} of {Math.ceil(count / 18)}
        </Text>

        {children}
      </div>
      <PageBar
        search={query}
        pages={Math.ceil(count / 18)}
        currentPage={page}
      />
    </div>
  );
};

export default ClientLayout;
