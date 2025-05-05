import { Helmet } from 'react-helmet';

function DashboardDetail() {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 대시보드 상세</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">모의 수강 신청 로그</h1>
      {/* Top Grid: 능력분석 + 수강 신청자 리스트 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사용자 능력 분석 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">사용자 능력 분석</h2>
          <div className="flex justify-center items-center h-64">
            {/* SVG or Radar Chart Placeholder */}
            <div className="w-60 h-60 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-400">
              SVG 레이더 차트 삽입
            </div>
          </div>
        </div>

        {/* 과목별 수강 신청 담은 사람 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">과목 별 수강 신청 담은 사람</h2>
          <table className="min-w-full text-sm text-center">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-2 px-2">학수번호</th>
                <th className="py-2 px-2">과목명</th>
                <th className="py-2 px-2">교수명</th>
                <th className="py-2 px-2">순위</th>
                <th className="py-2 px-2">관심시간</th>
                <th className="py-2 px-2">관심</th>
                <th className="py-2 px-2">성공/실패</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                {
                  id: '004310-004',
                  name: '운영체제',
                  prof: '이수형',
                  rank: '1/2순위',
                  time: '11/20초',
                  interest: '상',
                  result: '성공',
                },
                {
                  id: '002381-001',
                  name: '컴퓨터그래픽스',
                  prof: '하이',
                  rank: '1/2순위',
                  time: '11/20초',
                  interest: '상',
                  result: '성공',
                },
                {
                  id: '004110-007',
                  name: '디지털시스템',
                  prof: 'Rajendra Chikal',
                  rank: '1/2순위',
                  time: '11/20초',
                  interest: '상',
                  result: '성공',
                },
                {
                  id: '004310-004',
                  name: '운영체제',
                  prof: '이수형',
                  rank: '1/2순위',
                  time: '11/20초',
                  interest: '중',
                  result: '실패',
                },
                {
                  id: '004310-004',
                  name: '운영체제',
                  prof: '이수형',
                  rank: '1/2순위',
                  time: '11/20초',
                  interest: '하',
                  result: '실패',
                },
              ].map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-2">{row.id}</td>
                  <td className="py-2 px-2">{row.name}</td>
                  <td className="py-2 px-2">{row.prof}</td>
                  <td className="py-2 px-2">{row.rank}</td>
                  <td className="py-2 px-2">{row.time}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-white ${
                        row.interest === '상' ? 'bg-green-500' : row.interest === '중' ? 'bg-yellow-400' : 'bg-red-500'
                      }`}
                    >
                      {row.interest}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-xs ${
                        row.result === '성공' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {row.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">내 모의 수강 신청 별 TimeLine</h2>
        <div className="w-full overflow-x-auto">
          <div className="relative w-[900px] h-64 border-t border-l border-gray-200">
            {/* Timeline rows (예시) */}
            {[
              { label: '운영체제', time1: '1.03', time2: '2.59', success: true },
              { label: '컴퓨터그래픽스', time1: null, time2: null, success: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 mt-4">
                <div className={`text-sm ${item.success ? 'text-black' : 'text-red-500'}`}>{item.label}</div>
                <div className="relative flex-1 h-6">
                  {item.success ? (
                    <>
                      <div className="absolute left-[50px] top-0 text-xs text-gray-600">
                        신청 버튼 클릭
                        <br />
                        {item.time1} sec
                      </div>
                      <div className="absolute left-[150px] top-0 text-xs text-gray-600">
                        입력 완료 시간
                        <br />
                        {item.time2} sec
                      </div>
                      <div className="absolute left-[50px] top-5 w-[100px] h-2 bg-green-400 rounded-full"></div>
                    </>
                  ) : (
                    <div className="absolute left-[250px] top-5 w-[100px] h-2 bg-red-400 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default DashboardDetail;
