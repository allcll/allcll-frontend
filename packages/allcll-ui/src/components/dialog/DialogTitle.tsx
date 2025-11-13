function DialogTitle({ children }: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h3 id="dialog-title" className="font-semibold">
      {children}
    </h3>
  );
}

export default DialogTitle;
