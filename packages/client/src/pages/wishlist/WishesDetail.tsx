import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js/auto';
import Table from '@/components/wishTable/Table';
import CardWrap from '@/components/CardWrap';
import BlurComponents from '@/components/BlurComponents';
import DepartmentDoughnut from '@/components/wishTable/DepartmentDoughnut.tsx';
import { InitWishes } from '@/hooks/server/useWishes.ts';
import useDetailWishes from '@/hooks/server/useDetailWishes';
import useRecommendWishes from '@/hooks/server/useRecommendWishes';
import useDetailRegisters from '@/hooks/server/useDetailRegisters.ts';
import { getSeatColor, getWishesColor } from '@/utils/colors.ts';
import FavoriteButton from '@/components/wishTable/FavoriteButton.tsx';
import AlarmButton from '@/components/live/AlarmButton.tsx';
import usePreSeatGate from '@/hooks/usePreSeatGate';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// 학년별 관심도 (막대 그래프)
const gradeData = {
  labels: ['4학년', '3학년', '2학년', '1학년'],
  datasets: [
    {
      data: [50, 40, 25, 20],
      backgroundColor: '#60a5fa',
    },
  ],
};

function WishesDetail() {
  const params = useParams();
  const { data: wishes, isPending, isLastSemesterWish } = useDetailWishes(params.id ?? '-1');

  const { data: registers, error } = useDetailRegisters(params.id ?? '-1');
  const { data: recommend } = useRecommendWishes(
    wishes?.subjectCode ?? '',
    wishes?.subjectId ? [wishes.subjectId] : [],
  );

  const hasPreSeats = wishes && 'seat' in wishes;
  const { isPreSeatAvailable } = usePreSeatGate({ hasSeats: hasPreSeats });

  const seats = hasPreSeats ? wishes.seat : -1;

  const data = wishes ?? InitWishes;
  const isEng = wishes?.curiLangNm === '영어';
  const isDeleted = wishes?.isDeleted ?? false;

  if (isPending || !data) {
    return (
      <>
        <Helmet>
          <title>ALLCLL | 관심과목 분석 상세</title>
        </Helmet>

        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </>
    );
  }

  if (error) throw error;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 관심과목 분석 상세</title>
      </Helmet>

      {isLastSemesterWish && (
        <p className="bg-red-100 text-red-500 py-2 px-4 font-bold">
          이번 학기의 데이터가 아닙니다. 수강 신청에 유의해주세요.
        </p>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Course Info Section */}
        <div className="p-6 max-w-5xl mx-auto">
          <CardWrap>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{data.subjectName}</h1>

              <div className="flex items-center gap-2">
                <FavoriteButton subject={data} className="p-2 border rounded border-gray-300 hover:bg-gray-100" />
                <AlarmButton subject={data} className="p-2 border rounded border-gray-300 hover:bg-gray-100" />
              </div>
            </div>
            <p className="text-gray-600">
              {data.subjectCode}-{data.classCode} | {data.departmentName} | {data.professorName}
            </p>
            <div className="flex items-center gap-2 flex-wrap text-gray-600">
              <span>{data.studentYear}학년</span>
              <span>{data.curiTypeCdNm}</span>
              <span>{Number(data.tmNum.split('/')[0].trim())}학점</span>
              <span>
                {' '}
                | {data.lesnRoom} | {data.lesnTime}
              </span>
              {isPreSeatAvailable && (
                <p className={`text-sm px-2 py-1 rounded-full font-bold ${getSeatColor(seats)}`}>
                  여석: {seats < 0 ? '???' : seats}
                </p>
              )}
              {isEng && (
                <span className="bg-green-100 rounded px-2 py-1 text-green-500 text-xs font-semibold">영어</span>
              )}
              {isDeleted && (
                <span className="bg-red-100 rounded px-2 py-1 text-red-500 text-xs font-semibold">폐강</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{data.remark}</p>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Doughnut Chart */}
              <DepartmentDoughnut data={registers?.eachDepartmentRegisters ?? []} majorName={data.departmentName} />

              {/* Competition Analysis */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">관심과목 경쟁률 예상</h2>
                  <p className={`${getWishesColor(data.totalCount)} font-bold text-xl`}>총 {data.totalCount}명</p>
                </div>

                <BlurComponents>
                  <p className="text-sm text-gray-500">작년 대비 관심도 20% 증가 → 경쟁 치열할 가능성 높음</p>
                  <div className="mt-4">
                    <Bar data={gradeData} />
                  </div>
                </BlurComponents>
              </div>
            </div>

            {/* Alternative Course Table */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">대체과목 추천</h2>
              <p className="text-gray-500 text-sm mb-4">학수번호가 같은 과목을 알려드려요</p>

              <div className="overflow-x-auto">
                <Table data={recommend ?? []} />
              </div>
            </div>
          </CardWrap>
        </div>
      </div>
    </>
  );
}

export default WishesDetail;
