import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

function PageContainer({ children, className = '' }: PageContainerProps) {
  return <div className={`mx-auto w-full max-w-7xl px-4 md:px-16 pt-6 pb-12 ${className}`}>{children}</div>;
}

export default PageContainer;
