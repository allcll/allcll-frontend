import React from 'react';

interface SectionProps {
  bgColor?: string;
  className?: string;
  children: React.ReactNode;
}

function Section({ bgColor, className, children }: Readonly<SectionProps>) {
  const additionalStyle = bgColor ?? 'even:bg-white ';
  const additionalClass = className ? ` ${className}` : '';
  return (
    <section className={additionalStyle}>
      <div className={`mx-auto max-w-7xl px-4 md:px-8 py-10 ${additionalClass}`}>{children}</div>
    </section>
  );
}

export default Section;
