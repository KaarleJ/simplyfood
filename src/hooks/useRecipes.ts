import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Recipe } from '@/types';

const useRecipes = () => {
  const [query, setQuery] = useState<string>(''); // query state for search bar
  const [recipes, setRecipes] = useState<Recipe[]>([]); // recipes state for recipes
  const [count, setCount] = useState<number>(0); // count state for pagination
  const [page, setPage] = useState<number>(1); // page state for pagination

  const router = useRouter(); // router for url query

  // set query state if query is in url
  useEffect(() => {
    if (router.query.search) {
      setQuery(router.query.search as string);
    }
    if (router.query.page) {
      setPage(parseInt(router.query.page as string));
    }
  }, [router.query]);

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
      setRecipes(data.recipes);
      setCount(data.count);
    }
  }, [data]);

  return { recipes, loading, error, count, page, query, setQuery };
};

export default useRecipes;
