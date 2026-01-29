import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Table from '@/widgets/wishlist/Table';
import WishesBarChart from '@/widgets/wishlist/WishesBarChart.tsx';
import DepartmentDoughnut from '@/widgets/wishlist/DepartmentDoughnut.tsx';
import FavoriteButton from '@/features/filtering/ui/button/FavoriteButton.tsx';
import AlarmButton from '@/features/live/pin/ui/AlarmButton';
import { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import SubjectDetail from '@/entities/subjects/ui/SubjectDetail.tsx';
import useDetailWishes from '@/entities/subjectAggregate/model/useDetailWishes.ts';
import useRecommendWishes from '@/entities/subjectAggregate/model/useRecommendWishes.ts';
import useDetailRegisters from '@/entities/wishes/model/useDetailRegisters.ts';
import { getWishesColor } from '@/shared/config/colors.ts';
import { Card, Flex, Grid, Heading, SupportingText } from '@allcll/allcll-ui';

function WishesDetail() {
  const params = useParams();
  const subjectId = Number(params.id ?? '-1');
  const { data: wishes, isPending, isLastSemesterWish } = useDetailWishes(subjectId);
  const { data: registers, error } = useDetailRegisters(subjectId);

  const data = wishes ?? InitWishes;
  const isWishesAvailable = wishes && 'totalCount' in wishes;

  if (isPending || !data) {
    return (
      <>
        <Helmet>
          <title>ALLCLL | 관심과목 분석 상세</title>
          <meta name="description" content="세종대학교 관심과목의 상세 정보를 확인해보세요." />
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
          이번 학기의 과목이 아닙니다. 수강 신청에 유의해주세요.
        </p>
      )}

      {/*Fixme: div depth 최적화하기*/}
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-5xl mx-auto">
          <Card>
            <Flex justify="justify-between" align="items-center">
              <Heading level={1}>{data.subjectName}</Heading>

              <Flex gap="gap-2">
                <FavoriteButton subject={data} />
                <AlarmButton subject={data} />
              </Flex>
            </Flex>
            <SubjectDetail wishes={wishes} />

            {/* Analytics Section */}
            <Grid columns={{ md: 2, base: 1 }} gap="gap-6" className=" mt-6">
              {/* Doughnut Chart */}
              <Card className="p-6">
                <DepartmentDoughnut
                  data={registers?.eachDepartmentRegisters ?? []}
                  majorName={data.departmentName ?? data.manageDeptNm}
                />
              </Card>

              {/* Competition Analysis */}
              <Card>
                <Flex gap="gap-2" align="items-center" className="mb-4">
                  <Heading level={2}>관심과목 경쟁률 예상</Heading>
                  {isWishesAvailable && (
                    <p className={`${getWishesColor(data.totalCount ?? -1)} font-bold text-xl`}>
                      총 {data.totalCount}명
                    </p>
                  )}
                </Flex>

                <WishesBarChart />
              </Card>
            </Grid>

            {/* Alternative Course Table */}
            <Card>
              <Heading level={2} className="mt-2">
                대체과목 추천
              </Heading>
              <SupportingText>학수번호가 같은 과목을 알려드려요</SupportingText>

              <div className="overflow-x-auto">
                <RecommendationTable subjectId={subjectId} />
              </div>
            </Card>
          </Card>
        </div>
      </div>
    </>
  );
}

// Todo: 대체 과목 테이블, WishesTable 컴포넌트 합칠 수 있는지 확인
// 대체과목 테이블 컴포넌트
interface IRecommendationTableProps {
  subjectId: number;
}

function RecommendationTable({ subjectId }: IRecommendationTableProps) {
  const { data: recommend } = useRecommendWishes(subjectId);
  const placeholder = { title: '추천할 대체 과목이 없습니다.' };

  return <Table data={recommend ?? []} placeholder={placeholder} />;
}

export default WishesDetail;
