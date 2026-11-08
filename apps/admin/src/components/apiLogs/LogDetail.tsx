interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

export function DetailRow({ label, children }: DetailRowProps) {
  return (
    <p className="text-sm text-gray-500 break-all">
      <span className="font-semibold text-gray-700">{label}: </span>
      {children}
    </p>
  );
}
