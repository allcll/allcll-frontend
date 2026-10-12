function DialogTitle({ children, id }: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h2 id={id} className="font-semibold">
      {children}
    </h2>
  );
}

export default DialogTitle;
