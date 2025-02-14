import {Link, NavLink} from 'react-router-dom';
import LogoSvg from '@public/ci.svg?react';
import LogoName from '@public/logo-name.svg?react';

function Header() {
  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      <div className="container py-4 mb-1 flex items-center justify-between mx-auto max-w-7xl px-4 md:px-16">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="hidden">ALLCLL</h1>
            <LogoSvg className="w-8"/>
            <LogoName className="h-5 hidden sm:inline-block"/>
          </Link>

          <ul className="flex space-x-4 text-sm sm:text-base">
            <li>
              <NavLink to="/wishes"
                       className={({isActive}) => isActive ? "text-blue-500 font-semibold" : "text-gray-500"}>
                관심과목 분석
              </NavLink>
            </li>
            <li>
              <NavLink to="/live"
                       className={({isActive}) => isActive ? "text-blue-500 font-semibold" : "text-gray-500"}>
                수강 여석 확인
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;