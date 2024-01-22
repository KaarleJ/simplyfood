import { PropsWithChildren } from 'react';

interface PageProps extends PropsWithChildren {
  className?: string;
}

// This component will work as a wrapper for all pages.
const Paper = ({ className, children }: PageProps) => {

  return <div className={className}>{children}</div>;
};

export default Paper;