import { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import Text from './Text';

interface SearchBarProps extends PropsWithChildren {
  className?: string;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

const SearchBar = ({ className, query, setQuery }: SearchBarProps) => {
  const [input, setInput] = useState<string>(query); // input state for search field
  const router = useRouter(); // router for pushing query to url

  // On submit, set query state and push query to url
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // We set the query value on submit
    setQuery(input);
    // We push the query to the url
    if (input) {
      router.push({
        pathname: '/recipes',
        query: { search: input, page: 1 },
      });
    } else {
      router.push('/recipes');
    }
  };

  return (
    <div className={className}>
      {query ? (
        <Text className="text-xl">
          Showing results for <b>&quot;{query}&quot;</b>
        </Text>
      ) : (
        <a className="text-xl">Showing all recipes</a>
      )}
      <form onSubmit={handleSubmit}>
        <input
          className="border border-stone-400 rounded-md px-2 py-1 text-stone-500 text-sm"
          type="text"
          placeholder="search recipes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
