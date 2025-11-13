function DialogTitle({ children }: React.PropsWithChildren<{ id?: string }>) {
  return <h3 id="dialog-title">{children}</h3>;
}

export default DialogTitle;
