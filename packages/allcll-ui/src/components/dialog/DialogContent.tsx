function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col px-6 sm:py-4 py-4 gap-2 max-h-150 overflow-y-auto">{children}</div>;
}

export default DialogContent;
