function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col px-4 sm:px-6 py-3 sm:py-5  gap-2 max-h-150 overflow-y-auto">{children}</div>;
}

export default DialogContent;
