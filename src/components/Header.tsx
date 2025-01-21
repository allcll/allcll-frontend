import {Link} from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      <div className="container mx-auto p-4 mb-1 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-500">ALLCLL</h1>
        </Link>
      </div>
    </header>
  );
}

export default Header;