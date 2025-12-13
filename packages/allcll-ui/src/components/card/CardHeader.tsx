function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-start justify-between mb-3">{children}</div>;
}

export default CardHeader;
