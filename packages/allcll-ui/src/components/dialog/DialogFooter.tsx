function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="py-3 px-4 sm:px-6 border-t border-gray-100 flex justify-end gap-2">{children}</div>;
}

export default DialogFooter;
