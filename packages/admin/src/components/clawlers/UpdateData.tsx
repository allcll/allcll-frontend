import useDepartments from '@/hooks/server/useDepartments';
import useSubject from '@/hooks/server/useSubject';
import { Button, Card, Grid } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
import { useWishesAPI } from '@/hooks/server/useWishes';
import { usePreRealSeatsAPI } from '@/hooks/server/usePreRealSeats';

function UpdateData() {
  const { refetch: basketRefetch, isFetching: isBasketFetching } = useWishesAPI();
  const { refetch: preseatRefetch, isFetching: isPreseatFetching } = usePreRealSeatsAPI();
  const { refetch: subjectsRefetch, isFetching: isSubjectsFetching } = useSubject();
  const { refetch: departmentsRefetch, isFetching: isDepartmentFetching } = useDepartments();

  const dataSources = [
    { label: 'Baskets', refetch: basketRefetch, isFetching: isBasketFetching },
    { label: 'Preseats', refetch: preseatRefetch, isFetching: isPreseatFetching },
    { label: 'Subjects', refetch: subjectsRefetch, isFetching: isSubjectsFetching },
    { label: 'Department', refetch: departmentsRefetch, isFetching: isDepartmentFetching },
  ];

  return (
    <Card>
      <SectionHeader title="데이터 업데이트" description="백엔드 서버로 보내는 요청(크롤링X)" />

      <Grid columns={{ md: 4, sm: 2 }} gap="gap-3">
        {dataSources.map(({ label, refetch, isFetching }) => (
          <Button key={label} onClick={() => refetch()} variant="outlined" size="medium" disabled={isFetching}>
            {isFetching ? `${label} 불러오는 중...` : `${label} 업데이트`}
          </Button>
        ))}
      </Grid>
    </Card>
  );
}

export default UpdateData;
