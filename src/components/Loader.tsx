'use client';
import { Loader5 as LoaderIcon } from '@styled-icons/remix-line';

interface LoaderProps {
  className?: string;
  size?: string;
}

const Loader = ({ className, size }: LoaderProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <LoaderIcon
        size={size ? size : '64'}
        className="animate-spin text-gray-600"
      />
    </div>
  );
};

export default Loader;
