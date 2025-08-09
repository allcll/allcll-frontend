function Header() {
  return (
    <header className="bg-white shadow-xs p-4 z-50 sticky top-0">
      <div className="container flex items-center justify-between mx-auto max-w-7xl px-4 md:px-16">
        <h1 className="text-lg font-semibold">{}</h1>
        <span>TODO: Main인지 DEV인지 </span>
      </div>
    </header>
  );
}

export default Header;
