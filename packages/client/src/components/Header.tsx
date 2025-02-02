import {Link, NavLink} from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      <div className="container mx-auto p-4 mb-1 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <h1 className="text-2xl font-bold text-blue-500">ALLCLL</h1>
          </Link>

          <ul className="flex space-x-4">
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