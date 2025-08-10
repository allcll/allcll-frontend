import useDepartments from '@/hooks/server/useDepartments';
import usePreRealSeats from '@/hooks/server/usePreRealSeats';
import useSubject from '@/hooks/server/useSubject';
import useWishes from '@/hooks/server/useWishes';
import CustomButton from '@allcll/common/components/Button';

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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {dataSources.map(({ label, refetch, isFetching }) => (
        <CustomButton
          key={label}
          onClick={() => refetch()}
          variants="secondary"
          className="w-full"
          disabled={isFetching}
        >
          {isFetching ? `${label} 불러오는 중...` : `${label} 업데이트`}
        </CustomButton>
      ))}
    </div>
  );
}

export default UpdateData;
