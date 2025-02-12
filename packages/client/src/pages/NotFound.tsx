import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-lg mb-4">현재 페이지는 존재하지 않습니다</p>
      <Link to="/" className="text-blue-500">홈으로 돌아가기</Link>
    </div>
  );
};

export default NotFound;