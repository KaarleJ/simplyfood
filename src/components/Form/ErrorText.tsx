import { PropsWithChildren } from 'react';

const ErrorText = ({ children }: PropsWithChildren) => {
  return <a className="text-md text-red-600 ml-2">{children}</a>;
};

export default ErrorText;