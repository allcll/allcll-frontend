import type { ReactNode } from 'react';
import { Container } from '@allcll/allcll-ui';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
}

function PageContainer({ children, className = '', fluid = false }: PageContainerProps) {
  if (fluid) return <div className={`mx-auto w-full max-w-screen-2xl px-4 py-6 ${className}`}>{children}</div>;

  return <Container className={`py-6 ${className}`}>{children}</Container>;
}

export default PageContainer;
