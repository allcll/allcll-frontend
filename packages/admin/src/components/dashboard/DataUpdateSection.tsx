import useDepartments from '@/hooks/server/useDepartments';
import usePreRealSeats from '@/hooks/server/usePreRealSeats';
import useSubject from '@/hooks/server/useSubject';
import useWishes from '@/hooks/server/useWishes';
import { Button, Card } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';

function DataUpdateSection() {
  const { refetch: basketRefetch, isFetching: isBasketFetching } = useWishes();
  const { refetch: preseatRefetch, isFetching: isPreseatFetching } = usePreRealSeats();
  const { refetch: subjectsRefetch, isFetching: isSubjectsFetching } = useSubject();
  const { refetch: departmentsRefetch, isFetching: isDepartmentFetching } = useDepartments();

  const dataUpdateList = [
    { label: 'Baskets', time: '2025-01-07 14:30:25', refetch: basketRefetch, isFetching: isBasketFetching },
    { label: 'Preseats', time: '2025-01-07 14:30:25', refetch: preseatRefetch, isFetching: isPreseatFetching },
    { label: 'Subjects', time: '2025-01-07 14:30:25', refetch: subjectsRefetch, isFetching: isSubjectsFetching },
    {
      label: 'Department',
      time: '2025-01-07 14:30:25',
      refetch: departmentsRefetch,
      isFetching: isDepartmentFetching,
    },
  ];

  return (
    <section>
      <SectionHeader title="데이터 업데이트" description="백엔드 서버로 보내는 요청(크롤링X)" />

      <Card>
        <table className="w-full text-xs text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 text-gray-500 font-medium py-2">업데이트 항목</th>
              <th className="px-4 text-gray-500 font-medium py-2">마지막 업데이트</th>
              <th className="px-4 text-gray-500 font-medium py-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {dataUpdateList.map(({ label, time, refetch }) => (
              <tr key={label}>
                <td className="px-4 py-2 border-b border-gray-200">{label}</td>
                <td className="px-4 py-2 border-b border-gray-200">{time}</td>
                <td className="px-4 py-2 border-b border-gray-200">
                  <Button onClick={() => refetch()} variant="outlined" size="medium">
                    업데이트
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

export default DataUpdateSection;
