import { IconButton } from '@allcll/allcll-ui';

interface IToolbarButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, title, children }: IToolbarButtonProps) {
  return (
    <IconButton
      size="medium"
      icon={children}
      label={title}
      variant="plain"
      onClick={onClick}
      className="p-1.5 text-fg-muted hover:text-fg hover:bg-surface-strong transition-colors"
    />
  );
}

export default ToolbarButton;
