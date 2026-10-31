import type { ReactNode } from 'react';
import { Container } from '@allcll/allcll-ui';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

function PageContainer({ children, className = '' }: PageContainerProps) {
  return <Container className={`py-6 ${className}`}>{children}</Container>;
}

export default PageContainer;
