import { Link } from 'react-router-dom';
import LinkBlue from '@/assets/link-blue.svg?react';

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
          <h2 className="text-2xl font-semibold">{title}</h2>
          <LinkBlue className="w-4 h-4" />
        </Link>
      ) : (
        <h2 className="text-2xl font-semibold">{title}</h2>
      )}

      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </>
  );
}

export default SectionHeader;
