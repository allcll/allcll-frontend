function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="px-10 py-2 flex flex-col gap-2 overflow-y-auto">{children}</div>;
}

export default DialogContent;
