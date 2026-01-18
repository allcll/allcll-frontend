import { Heading } from '@allcll/allcll-ui';

const isDevelopment = import.meta.env.VITE_DEV_SERVER === 'true';

function Header() {
  return (
    <header className="bg-white shadow-xs p-4 z-50 sticky top-0">
      <div className="container flex items-center justify-between mx-auto max-w-7xl px-4 md:px-16">
        <Heading level={1}>올클 관리자 </Heading>
        <span className="text-sm font-semibold">{isDevelopment ? '개발모드' : 'Prod모드'} </span>
      </div>
    </header>
  );
}

export default Header;
