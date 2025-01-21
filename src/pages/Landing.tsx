import {Link} from 'react-router-dom';

function Landing() {
  return (
    <div className="font-sans">

      {/* Hero Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">수강 기회를 놓치지 마세요!</h2>
            <p className="text-gray-700 mb-6">
              원하는 과목의 여석을 실시간으로 확인하고 알림을 받아보세요. 로그인 없이 바로 시작할 수 있습니다.
            </p>
            <Link to='courses' className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600">
              무료로 시작하기
            </Link>
          </div>
          <div>
            <img src="/hero-image.png" alt="Dashboard preview" className="rounded-lg shadow-md" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">주요 기능</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h4 className="text-lg font-bold mb-2">실시간 여석 확인 및 알림</h4>
              <p className="text-gray-600">
                원하는 과목의 여석이 생기면 즉시 알림을 받아보세요.
              </p>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <h4 className="text-lg font-bold mb-2">로그인 없이 즉시 시작</h4>
              <p className="text-gray-600">
                별도의 회원가입 없이 바로 서비스를 이용할 수 있습니다.
              </p>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <h4 className="text-lg font-bold mb-2">관심 과목 핀 기능</h4>
              <p className="text-gray-600">
                원하는 과목을 한눈에 관리하고 모니터링할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">간단한 4단계로 시작하세요</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {['시작하기', '과목 검색', '관심 과목 파악하기', '자동 알림 받기'].map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow text-left">
                <h4 className="text-lg font-bold mb-2">{index + 1}. {step}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
