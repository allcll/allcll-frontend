import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LogoSvg from '@public/ci.svg?react';
import LogoName from '@public/logo-name.svg?react';
import CloseSvg from '@/assets/x.svg?react';
import { IconButton } from '@allcll/allcll-ui';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';
import { HeaderContents, ButtonContents } from './Header';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: Readonly<MobileMenuProps>) {
  const location = useLocation();

  const menuRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useBodyScrollLock(isOpen);

  return (
    <>
      <CSSTransition in={isOpen} timeout={300} classNames="mobile-menu-overlay" unmountOnExit nodeRef={overlayRef}>
        <button
          ref={overlayRef}
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="fixed inset-0 z-40 md:hidden bg-black/30 border-0 cursor-default focus:outline-none"
        />
      </CSSTransition>

      <CSSTransition in={isOpen} timeout={300} classNames="mobile-menu" unmountOnExit nodeRef={menuRef}>
        <nav
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          tabIndex={-1}
          className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden flex flex-col"
        >
          <h2 id="mobile-menu-title" className="sr-only">
            모바일 메뉴
          </h2>

          <div className="flex items-center justify-between p-4">
            <Link to="/" onClick={onClose} className="flex items-center gap-2" aria-label="메인 페이지">
              <LogoSvg className="w-6 h-6" />
              <LogoName className="h-5" />
            </Link>

            <IconButton
              className="p-2 hover:bg-gray-100 active:bg-gray-100"
              variant="plain"
              icon={<CloseSvg className="w-6 h-6" />}
              label="메뉴 닫기"
              onClick={onClose}
            />
          </div>

          <hr className="mx-4 border-gray-300" />

          <ul className="flex-1 p-4 space-y-1">
            {HeaderContents.map(({ title, path, end }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-500' : 'text-gray-700 active:bg-gray-100'
                    }`
                  }
                >
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>

          <hr className="mx-4 border-gray-300" />

          <div className="p-4 space-y-1">
            {ButtonContents.map(({ icon, title, path }) => (
              <a
                key={path}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-600 active:bg-gray-100 transition-colors"
              >
                {icon}
                <span className="text-sm">{title}</span>
              </a>
            ))}
          </div>
        </nav>
      </CSSTransition>
    </>
  );
}

export default MobileMenu;
