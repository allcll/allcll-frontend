import { Heading, SupportingText } from '@allcll/allcll-ui';

interface PageHeaderProps {
  title: string;
  description?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export function PageHeader({ title, description, gap = 'sm' }: PageHeaderProps) {
  const gapMap = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  return (
    <header className={`flex flex-col ${gapMap[gap]}`}>
      <Heading level={1}>{title}</Heading>
      {description && <SupportingText>{description}</SupportingText>}
    </header>
  );
}

export default PageHeader;
