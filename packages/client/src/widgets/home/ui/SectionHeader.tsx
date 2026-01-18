import { Link } from 'react-router-dom';
import LinkBlue from '@/assets/link-blue.svg?react';
import { Heading, SupportingText } from '@allcll/allcll-ui';

interface ISectionHeader {
  title?: string;
  subtitle?: string;
  href?: string;
  disabled?: boolean;
}

function SectionHeader({ title, subtitle, href, disabled = false }: ISectionHeader) {
  const isLink = !!href && !disabled;

  return (
    <>
      {isLink ? (
        <Link to={href} className="flex items-center gap-2 hover:underline focus:underline">
          <Heading level={2}>{title}</Heading>
          <LinkBlue className="w-4 h-4" />
        </Link>
      ) : (
        <Heading level={2}>{title}</Heading>
      )}

      {subtitle && <SupportingText>{subtitle}</SupportingText>}
    </>
  );
}

export default SectionHeader;
