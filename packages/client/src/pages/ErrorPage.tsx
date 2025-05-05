import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 오류가 발생했습니다</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">오류가 발생했습니다</h1>
        <p className="text-lg mb-4">문제가 발생했어요. 잠시 기다렸다 다시 시도해보세요</p>
        <Link to="/" className="text-blue-500">
          홈으로 돌아가기
        </Link>
        <Link to="/survey" className="text-blue-500">
          문의하기
        </Link>
      </div>
    </>
  );
};

export default ErrorPage;
