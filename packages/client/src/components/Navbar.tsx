import {NavLink} from 'react-router-dom';

const NavLinks = [
  {title: '실시간', path: '/courses'},
  {title: '과목 검색', path: '/search'},
]

const Navbar = () => {
  return (
    <nav className='mb-4'>
      <div className="border-b border-gray-200">
        <ul className="flex space-x-4 px-4 py-2">
          {NavLinks.map(({title, path}) => (
            <li key={path} className="font-bold">
              <NavLink to={path} className={
                ({isActive}) => isActive ? 'text-blue-500' : 'text-gray-700'
              }>
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
