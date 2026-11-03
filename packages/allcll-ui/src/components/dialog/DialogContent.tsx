function DialogContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col px-4 sm:px-6 py-4 gap-2 max-h-150 overflow-y-auto ${className}`}>{children}</div>
  );
}

export default DialogContent;
