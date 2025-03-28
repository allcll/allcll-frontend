import {Link, NavLink} from 'react-router-dom';
import LogoSvg from '@public/ci.svg?react';
import LogoName from '@public/logo-name.svg?react';

const HeaderContents = [
  {title: '관심과목 분석', path: '/wishes', end: false},
  {title: '수강 여석 확인', path: '/live', end: true},
];

const ButtonContents = [
  {title: '공지 채팅방', path: 'https://open.kakao.com/o/g3MztXfh', end: false},
  {title: '오류 및 제안', path: '/survey', end: true},
];

function Header() {
  const randomButtonNum = Math.floor(Math.random() * ButtonContents.length);
  const randomButton = ButtonContents[randomButtonNum];

  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      <div className="container mb-1 flex items-center justify-between mx-auto max-w-7xl px-4 md:px-16">
        <div className="flex items-center space-x-4 py-4">
          <Link to="/" className="flex items-center space-x-2" aria-label='메인 페이지'>
            <h1 className="hidden">ALLCLL</h1>
            <LogoSvg className="w-8"/>
            <LogoName className="h-5 hidden sm:inline-block"/>
          </Link>

          <ul className="flex space-x-4 text-sm sm:text-base">
            {HeaderContents.map(({title, path, end}) => (
              <li key={path} className="font-bold">
                <NavLink to={path} end={end} className={
                  ({isActive}) => isActive ? "text-blue-500 font-semibold" : "text-gray-500"
                }>
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="items-center space-x-4 hidden sm:flex">
          <Link to={randomButton.path} className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md">
            {randomButton.title}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;