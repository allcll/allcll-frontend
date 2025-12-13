function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col px-8 py-5 gap-2 max-h-120 overflow-y-auto">{children}</div>;
}

export default DialogContent;
