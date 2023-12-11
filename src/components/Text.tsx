import { PropsWithChildren } from 'react';

interface TextProps extends PropsWithChildren {
  header?: boolean;
}

// This is the standard styled component for text.
const Text = ({ children, header }: TextProps) => {
  return (
    <>
      {header ? (
        <a className="text-3xl text-bold text-stone-800 m-5">{children}</a>
      ) : (
        <a className="text-xl text-stone-600">{children}</a>
      )}
    </>
  );
};

export default Text;
