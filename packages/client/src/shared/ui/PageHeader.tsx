import type { ReactNode } from 'react';
import { Flex, Heading, SupportingText } from '@allcll/allcll-ui';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <Flex justify="between" align="center">
        <Heading level={1}>{title}</Heading>
        {actions}
      </Flex>
      {description && <SupportingText>{description}</SupportingText>}
    </div>
  );
}

export default PageHeader;
