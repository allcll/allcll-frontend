import { Heading, SupportingText } from '@allcll/allcll-ui';

interface SectionHeaderProps {
  title: string;
  description?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export function SectionHeader({ title, description, gap = 'sm' }: SectionHeaderProps) {
  const gapMap = {
    sm: 'gap-0',
    md: 'gap-2',
    lg: 'gap-3',
  };

  return (
    <div className={`flex flex-col ${gapMap[gap]} mb-2`}>
      <Heading level={3}>{title}</Heading>
      {description && <SupportingText>{description}</SupportingText>}
    </div>
  );
}

export default SectionHeader;
