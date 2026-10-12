import type { ComponentPropsWithoutRef } from 'react';
import { FIELD_CLASS } from '../../config';

interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  className?: string;
}

function Textarea({ className = '', ...rest }: TextareaProps) {
  return <textarea {...rest} className={`w-full min-h-20 resize-y px-3 ${FIELD_CLASS} ${className}`} />;
}

export default Textarea;
