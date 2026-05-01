import { useState } from 'react';
import { Helmet } from 'react-helmet';
import WishesBarChart from '@/widgets/wishlist/WishesBarChart.tsx';
import DepartmentDoughnut from '@/widgets/wishlist/DepartmentDoughnut';
import RecommendWishes from '@/widgets/wishlist/RecommendWishes';
import WishesDetailInfo from '@/widgets/wishlist/WishesDetailInfo';
import useWishesInfo from '@/features/wish/model/useWishesInfo';
import useDetailRegisters from '@/entities/wishes/model/useDetailRegisters';
import { WishesInfo } from '@/shared/model/types';
import { Banner, Card, Grid } from '@allcll/allcll-ui';

function WishesDetail() {
  const wishesInfo = useWishesInfo();

  const { error } = useDetailRegisters(wishesInfo);
  if (error) throw error;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 관심과목 분석 상세</title>
        <meta name="description" content="세종대학교 관심과목의 상세 정보를 확인해보세요." />
      </Helmet>

      <WishesSemesterBanner wishesInfo={wishesInfo} />

      {/*Fixme: div depth 최적화하기*/}
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-5xl mx-auto">
          <Card>
            <WishesDetailInfo wishesInfo={wishesInfo} />

            {/* Analytics Section */}
            <Grid columns={{ md: 2, base: 1 }} gap="gap-6" className=" mt-6">
              <Card className="p-6">
                <DepartmentDoughnut wishesInfo={wishesInfo} />
              </Card>
              <Card>
                <WishesBarChart wishesInfo={wishesInfo} />
              </Card>
            </Grid>

            <Card>
              <RecommendWishes wishesInfo={wishesInfo} />
            </Card>
          </Card>
        </div>
      </div>
    </>
  );
}

function WishesSemesterBanner({ wishesInfo }: { wishesInfo: WishesInfo }) {
  const [showBanner, setShowBanner] = useState(true);

  if (!wishesInfo.isLastSemesterWish || !showBanner) return null;

  return (
    <Banner variant="warning" deleteBanner={() => setShowBanner(false)}>
      {wishesInfo.semesterValue}학기의 과목 입니다. 수강 신청에 유의해주세요.
    </Banner>
  );
}

export default WishesDetail;
