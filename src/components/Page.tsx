import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';
import { Loader5 as Loader } from '@styled-icons/remix-line';

interface PageProps extends PropsWithChildren {
  className?: string;
}

// This component will work as a wrapper for all pages.
const Page = ({ className, children }: PageProps) => {
  const router = useRouter(); // router for url query
  const [isLoading, setIsLoading] = useState<boolean>(false); // loading state for search ui

  // We use useEffect to set the loading state to true when the route changes.
  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // If the page is loading we return loading ui
  if (isLoading) {
    return (
      <div className={`${className} flex justify-center items-center`}>
        <Loader size="64" className='animate-spin text-gray-600'/>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

export default Page;
