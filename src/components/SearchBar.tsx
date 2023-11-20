import { Dispatch, PropsWithChildren, SetStateAction } from 'react';

interface SearchBarProps extends PropsWithChildren {
  className?: string;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchBar = ({
  className,
  query,
  setQuery,
  handleSearch,
}: SearchBarProps) => {
  return (
    <div className={className}>
      {query ? (
        <a className="text-xl">
          Showing results for <b>&quot;{query}&quot;</b>
        </a>
      ) : (
        <a className="text-xl">Showing all recipes</a>
      )}
      <form onSubmit={handleSearch}>
        <input
          className="border border-stone-400 rounded-md px-2 py-1 text-stone-500 text-sm"
          type="text"
          placeholder="search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        <button
          type="submit"
          className="px-2 py-1 mx-1 rounded-md bg-lime-300 font-bold text-white hover:brightness-90 transition-all mr-4"
        >
          search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
