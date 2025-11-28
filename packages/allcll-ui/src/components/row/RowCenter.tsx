import type { ReactNode } from 'react';

function RowCenter({ children }: { children: ReactNode }) {
  return <div className="flex-1">{children}</div>;
}

export default RowCenter;
