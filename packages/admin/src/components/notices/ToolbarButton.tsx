import { IconButton } from '@allcll/allcll-ui';

interface Props {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, title, children }: Props) {
  return (
    <IconButton
      icon={children}
      label={title}
      variant="plain"
      onClick={onClick}
      className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
    />
  );
}

export default ToolbarButton;
