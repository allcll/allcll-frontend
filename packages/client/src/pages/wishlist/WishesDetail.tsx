import { Helmet } from 'react-helmet';
import WishesBarChart from '@/widgets/wishlist/WishesBarChart';
import DepartmentDoughnut from '@/widgets/wishlist/DepartmentDoughnut';
import RecommendWishes from '@/widgets/wishlist/RecommendWishes';
import WishesDetailInfo from '@/widgets/wishlist/WishesDetailInfo';
import WishesSemesterBanner from '@/widgets/wishlist/WishesSemesterBanner';
import useWishesInfo from '@/features/wish/model/useWishesInfo';
import useDetailRegisters from '@/entities/wishes/model/useDetailRegisters';
import useDetailWishes from '@/entities/subjectAggregate/model/useDetailWishes';
import { Card, Grid } from '@allcll/allcll-ui';
import PageContainer from '@/shared/ui/PageContainer';

function WishesDetail() {
  const wishesInfo = useWishesInfo();

  const { error } = useDetailRegisters(wishesInfo);
  const { data: wishes } = useDetailWishes(wishesInfo);
  if (error) throw error;

  return (
    <>
      <Helmet>
        <title>{`ALLCLL | ${wishes ? `${wishes.subjectName} - ` : ''}관심과목 분석`}</title>
        <meta name="description" content="세종대학교 관심과목의 상세 정보를 확인해보세요." />
      </Helmet>

      <WishesSemesterBanner wishesInfo={wishesInfo} />

      <PageContainer>
        <Card>
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

          <Card className="mt-6">
            <RecommendWishes wishesInfo={wishesInfo} />
          </Card>
        </Card>
      </PageContainer>
    </>
  );
}

export default WishesDetail;
