import { PropsWithChildren } from 'react';

interface TextProps extends PropsWithChildren {
  header?: boolean;
  className?: string;
}

// This is the standard styled component for text.
const Text = ({ children, header, className }: TextProps) => {
  return (
    <>
      {header ? (
        <h1 className={`text-3xl text-bold text-stone-800 ${className}`}>{children}</h1>
      ) : (
        <p className={`text-xl text-stone-600 ${className}`}>{children}</p>
      )}
    </>
  );
};

export default Text;
