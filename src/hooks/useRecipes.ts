import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const useRecipes = () => {
  const [query, setQuery] = useState<string>(''); // query state for search bar
  const [count, setCount] = useState<number>(0); // count state for pagination
  const [page, setPage] = useState<number>(1); // page state for pagination
  const searchParams = useSearchParams(); // searchParams for url query

  // set query state if query is in url
  useEffect(() => {
    if (searchParams?.get('search')) {
      setQuery(searchParams?.get('search') as string);
    }
    if (searchParams?.get('page')) {
      setPage(parseInt(searchParams?.get('page') as string));
    }
  }, [searchParams]);

  // Fetch recipes and count from api
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(`/api/recipes?search=${query}&page=${page}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  // Set recipes and count state from data
  useEffect(() => {
    if (data) {
      setCount(data.count);
    }
  }, [data]);

  return { loading, error, count, page, query, setQuery };
};

export default useRecipes;