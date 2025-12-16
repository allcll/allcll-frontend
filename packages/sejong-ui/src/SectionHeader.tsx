import React from 'react';

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

function SectionHeader({ children, className = '' }: SectionHeaderProps) {
  const baseClass = 'font-semibold pl-2 border-l-4 border-blue-500';
  const finalClassName = `${baseClass} ${className}`.trim();

  return <div className={finalClassName}>{children}</div>;
}

export default SectionHeader;
