const isProduction = import.meta.env.VITE_DEV_SERVER === 'true';

function Header() {
  return (
    <header className="bg-white shadow-xs p-4 z-50 sticky top-0">
      <div className="container flex items-center justify-between mx-auto max-w-7xl px-4 md:px-16">
        <h1 className="text-lg font-semibold">올클 관리자</h1>
        <span className="text-sm font-semibold">{isProduction ? 'Prod모드' : '개발모드'} </span>
      </div>
    </header>
  );
}

export default Header;
