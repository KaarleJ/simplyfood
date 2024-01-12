import { PropsWithChildren } from 'react';

const ErrorText = ({ children }: PropsWithChildren) => {
  return <p className="text-md text-red-600 ml-2">{children}</p>;
};

export default ErrorText;