function DialogTitle({ children }: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h2 id="dialog-title" className="font-semibold">
      {children}
    </h2>
  );
}

export default DialogTitle;
