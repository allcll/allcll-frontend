import {Link} from 'react-router-dom';

const Features = [
  {title: "실시간 여석 확인 및 알림", content: "원하는 과목의 여석이 생기면 즉시 알림을 받아보세요."},
  {title: "로그인 없이 즉시 시작", content: "별도의 회원가입 없이 바로 서비스를 이용할 수 있습니다."},
  {title: "관심 과목 핀 기능", content: "원하는 과목을 한눈에 관리하고 모니터링할 수 있습니다."}
]

const StartPassages = [
  {title: "시작하기", content: "버튼 클릭 한 번으로 바로 시작"},
  {title: "과목 검색", content: "원하는 과목을 쉽게 찾기"},
  {title: "관심 과목 파악하기", content: "모니터링할 과목 선택"},
  {title: "자동 알림 받기", content: "여석 발생 시 즉시 알림"}
];

function Landing() {
  return (
    <div className="font-sans">

      {/* Hero Section */}
      <section className="bg-gray-50 sm:px-4 py-20 px-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">수강 기회를 놓치지 마세요!</h2>
            <p className="text-gray-700 mb-6">
              원하는 과목의 여석을 실시간으로 확인하고 알림을 받아보세요. 로그인 없이 바로 시작할 수 있습니다.
            </p>
            <Link to='/live'
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600">
              무료로 시작하기
            </Link>
          </div>
          <div className="rounded-lg shadow-md">
            <img src="/hero-image.png" alt="Dashboard preview" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-16 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">주요 기능</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {Features.map((feature, index) => (
              <div key={index} className="border border-gray-200 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600">
                  {feature.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-gray-50 py-16 px-16 sm:px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-8">간단한 4단계로 시작하세요</h3>
            <ul>
              {StartPassages.map(({title, content}, index) => (
                <li key={index} className="flex items-center gap-4 p-6 text-left">
                  <div className="bg-blue-500 text-white rounded-full size-12 flex justify-center items-center">{index+1}</div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{title}</h4>
                    <p className="text-gray-500">{content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-0 invisible lg:visible lg:h-auto">
            <img src="/feature-image.png" alt="Dashboard preview" className="rounded-lg shadow-md" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
