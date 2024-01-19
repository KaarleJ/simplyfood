'use client';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftSquareFill,
  ArrowRightSquareFill,
} from 'styled-icons/bootstrap';

interface PageBarProps {
  className?: string;
  pages: number;
  currentPage: number;
  search: string;
}

const PageBar = ({
  className,
  pages,
  currentPage,
  search,
}: PageBarProps) => {
  const router = useRouter();
  return (
    <div className={`flex justify-center ${className}`}>
      <button
        disabled={currentPage === 1}
        onClick={() =>
          router.push(`/recipes?search=${search}&page=${currentPage - 1}`)
        }
      >
        <ArrowLeftSquareFill size={28} className="text-xl text-lime-300 m-2" />
      </button>
      <ul className="flex justify-center">
        {Array.from({ length: pages }, (_, i) => i + 1).map((page) => {
          if (page === currentPage)
            return (
              <button
                disabled
                className="border border-gray-600 rounded bg-gray-300 m-2 p-2 shadow-md"
                key={page}
              >
                {page}
              </button>
            );
          return (
            <button
              onClick={() => {
                router.push(`/recipes?search=${search}&page=${page}`);
              }}
              className="border border-gray-600 rounded bg-gray-100 m-2 p-2 shadow-md"
              key={page}
            >
              {page}
            </button>
          );
        })}
      </ul>
      <button
        onClick={() => {
          router.push(`/recipes?search=${search}&page=${currentPage+1}`);
        }}
        disabled={currentPage === pages}
      >
        <ArrowRightSquareFill size={28} className="text-xl text-lime-300 m-2" />
      </button>
    </div>
  );
};

export default PageBar;