import { Helmet } from 'react-helmet';
import WishesBarChart from '@/widgets/wishlist/WishesBarChart';
import DepartmentDoughnut from '@/widgets/wishlist/DepartmentDoughnut';
import RecommendWishes from '@/widgets/wishlist/RecommendWishes';
import WishesDetailInfo from '@/widgets/wishlist/WishesDetailInfo';
import WishesSemesterBanner from '@/widgets/wishlist/WishesSemesterBanner';
import useWishesInfo from '@/features/wish/model/useWishesInfo';
import useDetailRegisters from '@/entities/wishes/model/useDetailRegisters';
import { Card, Grid } from '@allcll/allcll-ui';

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

      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-5xl mx-auto">
          <WishesDetailInfo wishesInfo={wishesInfo} />

          {/* Analytics Section */}
          <Grid columns={{ md: 2, base: 1 }} gap="gap-6" className="mt-6">
            <Card className="p-6">
              <DepartmentDoughnut wishesInfo={wishesInfo} />
            </Card>
            <Card className="p-6">
              <WishesBarChart wishesInfo={wishesInfo} />
            </Card>
          </Grid>

          <Card className="mt-2">
            <RecommendWishes wishesInfo={wishesInfo} />
          </Card>
        </Card>
      </div>
    </>
  );
}

export default WishesDetail;
