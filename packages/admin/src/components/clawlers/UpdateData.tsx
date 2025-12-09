import useDepartments from '@/hooks/server/useDepartments';
import usePreRealSeats from '@/hooks/server/usePreRealSeats';
import useSubject from '@/hooks/server/useSubject';
import useWishes from '@/hooks/server/useWishes';
import { Button } from '@allcll/allcll-ui';

function UpdateData() {
  const { refetch: basketRefetch, isFetching: isBasketFetching } = useWishes();
  const { refetch: preseatRefetch, isFetching: isPreseatFetching } = usePreRealSeats();
  const { refetch: subjectsRefetch, isFetching: isSubjectsFetching } = useSubject();
  const { refetch: departmentsRefetch, isFetching: isDepartmentFetching } = useDepartments();

  const dataSources = [
    { label: 'Baskets', refetch: basketRefetch, isFetching: isBasketFetching },
    { label: 'Preseats', refetch: preseatRefetch, isFetching: isPreseatFetching },
    { label: 'Subjects', refetch: subjectsRefetch, isFetching: isSubjectsFetching },
    { label: 'Department', refetch: departmentsRefetch, isFetching: isDepartmentFetching },
  ];

  return (
    <>
      <div>
        <h3 className="text-md font-semibold mb-3">데이터 업데이트</h3>
        <span className="text-sm text-gray-500">백엔드 서버로 보내는 요청(크롤링X)</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {dataSources.map(({ label, refetch, isFetching }) => (
          <Button key={label} onClick={() => refetch()} variant="outlined" size="medium" disabled={isFetching}>
            {isFetching ? `${label} 불러오는 중...` : `${label} 업데이트`}
          </Button>
        ))}
      </div>
    </>
  );
}

export default UpdateData;
