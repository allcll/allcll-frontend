import type { ComponentType, ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

function EmptyState({ icon: Icon, title, description, children, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 text-center ${className}`}>
      {Icon && (
        <span aria-hidden="true" className="mb-1">
          <Icon className="w-7 h-7 text-fg-subtle" />
        </span>
      )}
      <p className="text-sm font-medium text-fg-muted">{title}</p>
      {description && <p className="text-xs text-fg-subtle">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default EmptyState;
