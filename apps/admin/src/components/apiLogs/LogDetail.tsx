interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

export function DetailRow({ label, children }: DetailRowProps) {
  return (
    <p className="text-sm text-fg-muted break-all">
      <span className="font-semibold text-fg-secondary">{label}: </span>
      {children}
    </p>
  );
}
