import type { ReactNode } from 'react';

function RowLeft({ children }: { children: ReactNode }) {
  return <div className="mr-3 flex-shrink-0 flex items-center justify-center">{children}</div>;
}

export default RowLeft;
