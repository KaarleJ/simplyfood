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
        <a className={`text-3xl text-bold text-stone-800 ${className}`}>{children}</a>
      ) : (
        <a className={`text-xl text-stone-600 ${className}`}>{children}</a>
      )}
    </>
  );
};

export default Text;
