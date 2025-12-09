import useDepartments from '@/hooks/server/useDepartments';
import usePreRealSeats from '@/hooks/server/usePreRealSeats';
import useSubject from '@/hooks/server/useSubject';
import useWishes from '@/hooks/server/useWishes';
import { Card } from '@allcll/allcll-ui';

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
      <h2 className="text-lg text-gray-700 font-bold mb-4">데이터 업데이트 상태</h2>
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
                  <button onClick={() => refetch()} className="text-gray-500 hover:underline cursor-pointer">
                    업데이트
                  </button>
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
