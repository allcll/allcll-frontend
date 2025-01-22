function CardWrap({ children }: { children: React.ReactNode }) {
  return <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
    {children}
  </div>;
}

export default CardWrap;