function Navigation() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-6 text-sm font-medium text-gray-700">
          <li className="border-b-2 border-blue-500 py-2">검색</li>
          <li className="py-2 hover:text-blue-500 cursor-pointer">핀 목록</li>
          <li className="py-2 hover:text-blue-500 cursor-pointer">교양과목</li>
          <li className="py-2 hover:text-blue-500 cursor-pointer">전공과목</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
