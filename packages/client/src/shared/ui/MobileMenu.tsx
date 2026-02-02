import { useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LogoSvg from '@public/ci.svg?react';
import LogoName from '@public/logo-name.svg?react';
import CloseSvg from '@/assets/x.svg?react';
import { Flex, IconButton } from '@allcll/allcll-ui';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';
import { HeaderContents, ButtonContents } from './Header';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: Readonly<MobileMenuProps>) {
  const navigate = useNavigate();

  const menuRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const targetPath = useRef<string | null>(null);

  const navigateWithClose = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    targetPath.current = path;
    onClose();
  };

  const handleExited = () => {
    if (targetPath.current) {
      navigate(targetPath.current);
      targetPath.current = null;
    }
  };

  useBodyScrollLock(isOpen);

  return (
    <>
      <CSSTransition in={isOpen} timeout={300} classNames="mobile-menu-overlay" unmountOnExit nodeRef={overlayRef}>
        <div ref={overlayRef} className="fixed inset-0 z-40 md:hidden bg-black/30" aria-hidden="true" />
      </CSSTransition>

      <CSSTransition in={isOpen} timeout={300} classNames="mobile-menu" unmountOnExit nodeRef={menuRef} onExited={handleExited}>
        <nav
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        tabIndex={-1}
        className="fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 md:hidden flex flex-col"
      >
        <h2 id="mobile-menu-title" className="sr-only">
          모바일 메뉴
        </h2>

        <Flex justify="justify-between" align="items-center" gap="gap-0" className="p-4">
          <Link to="/" onClick={(e) => navigateWithClose('/', e)} className="flex items-center gap-2" aria-label="메인 페이지">
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
        </Flex>

        <hr className="mx-4 border-gray-300" />

        <Flex as="ul" direction="flex-col" gap="gap-1" className="flex-1 p-4">
          {HeaderContents.map(({ title, path, end }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                onClick={(e) => navigateWithClose(path, e)}
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
        </Flex>

        <hr className="mx-4 border-gray-300" />

        <Flex gap="gap-2" className="p-4">
          {ButtonContents.map(({ icon, title, path }) => (
            <a
              key={path}
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-200 text-gray-600 active:bg-gray-100 transition-colors"
            >
              {icon}
              <span className="text-sm">{title}</span>
            </a>
          ))}
        </Flex>
      </nav>
      </CSSTransition>
    </>
  );
}

export default MobileMenu;
