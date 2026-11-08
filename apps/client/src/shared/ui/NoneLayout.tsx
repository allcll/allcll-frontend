import type { ComponentProps } from 'react';
import { EmptyState } from '@allcll/allcll-ui';

type NoneLayoutProps = ComponentProps<typeof EmptyState>;

function NoneLayout({ className = '', ...props }: Readonly<NoneLayoutProps>) {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-50 rounded-md">
      <EmptyState {...props} className={`p-12 ${className}`} />
    </div>
  );
}

export default NoneLayout;
