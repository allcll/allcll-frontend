function DialogTitle({ children }: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h2 id="dialog-title" className="text-base">
      {children}
    </h2>
  );
}

export default DialogTitle;
