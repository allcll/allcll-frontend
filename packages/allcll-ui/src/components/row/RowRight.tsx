import type { ReactNode } from 'react';

function RowRight({ children }: { children: ReactNode }) {
  return <div className="ml-3 flex-shrink-0 flex items-center justify-center">{children}</div>;
}

export default RowRight;
