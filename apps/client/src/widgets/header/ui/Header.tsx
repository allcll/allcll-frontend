import { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoCiUrl from '@/assets/logo/ci-summer.svg';
import logoNameUrl from '@/assets/logo/logo-name-summer.svg';
import { MenuIcon, IconButton, Badge, Container } from '@allcll/allcll-ui';
import NoticeBell from '@/features/notices/ui/NoticeBell';
import MobileMenu from '@/shared/ui/MobileMenu';
import { HeaderContents, ButtonContents } from '@/shared/config/navigation.tsx';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <header className="bg-white shadow-sm z-header sticky top-0">
      <Container className="flex items-center justify-between">
        <div className="flex items-center space-x-4 py-4">
          <Link to="/" className="flex items-center gap-1 space-x-2" aria-label="메인 페이지">
            <h2 className="hidden">ALLCLL</h2>
            <img src={logoCiUrl} alt="" className="w-6 h-6 m-0" />
            <img src={logoNameUrl} alt="" className="h-5" />
          </Link>

          <ul className="hidden md:flex space-x-4 text-sm sm:text-base">
            {HeaderContents.map(({ title, path, end, beta }) => (
              <li key={path} className="font-bold">
                <NavLink
                  to={path}
                  end={end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1 whitespace-nowrap ${isActive ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700'}`
                  }
                >
                  {title}
                  {beta && (
                    <Badge color="danger" variant="outlined" size="small">
                      Beta
                    </Badge>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="items-center space-x-2 hidden md:flex">
          {ButtonContents.map(({ icon, title, path }) => (
            <a
              key={path}
              href={path}
              target="_blank"
              aria-label={title}
              title={title}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {icon}
            </a>
          ))}
          <NoticeBell />
        </div>
        <div className="md:hidden flex items-center gap-1">
          <NoticeBell />
          <IconButton
            size="large"
            className="p-2 hover:bg-gray-100 active:bg-gray-100"
            variant="plain"
            icon={<MenuIcon className="text-gray-500" />}
            label="메뉴 열기"
            onClick={openMenu}
            aria-expanded={isOpen}
          />
        </div>
      </Container>

      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </header>
  );
}

export default Header;
