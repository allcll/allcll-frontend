import type { ComponentPropsWithoutRef } from 'react';

function Container({ className = '', ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div {...rest} className={`mx-auto w-full max-w-7xl px-4 md:px-16 ${className}`} />;
}

export default Container;
