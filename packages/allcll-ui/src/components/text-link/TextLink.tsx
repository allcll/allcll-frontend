import type { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

interface TextLinkProps extends ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
}

function TextLink({ asChild = false, className = '', ...props }: TextLinkProps) {
  const Comp = asChild ? Slot : 'a';

  return <Comp {...props} className={`text-primary-500 underline hover:text-primary-600 ${className}`} />;
}

export default TextLink;
