import { usePopoverContext } from '../popover/Popover';

const PopoverContent = ({ children }: { children: React.ReactNode; icon?: React.ReactNode }) => {
  const { isOpen, position, contentRef } = usePopoverContext();
  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      style={{
        top: 0,
        left: 0,
        transform: `translate(${position?.x}px, ${position?.y}px)`,
      }}
      className="border mt-1 border-gray-200  shadow-lg rounded-lg bg-white p-4"
    >
      {children}
    </div>
  );
};

export default PopoverContent;
