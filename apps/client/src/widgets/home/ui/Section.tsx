import React from 'react';
import { Container } from '@allcll/allcll-ui';

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
      <Container className={`py-10 ${additionalClass}`}>{children}</Container>
    </section>
  );
}

export default Section;
