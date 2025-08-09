import Card from '@allcll/common/components/Card';

/**
 *
 */
const dataUpdateList = [
  { type: 'Baskets', time: '2025-01-07 14:30:25' },
  { type: 'Preseats', time: '2025-01-07 14:28:15' },
  { type: 'Subjects', time: '2025-01-07 14:25:42' },
  { type: 'Department', time: '2025-01-07 14:20:18' },
];

function DataUpdateSection() {
  return (
    <section>
      <h2 className="text-lg text-gray-700 font-bold mb-4">데이터 업데이트 상태</h2>
      <Card className="overflow-hidden">
        <table className="w-full text-xs text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 text-gray-500 font-medium py-2">업데이트 항목</th>
              <th className="px-4 text-gray-500 font-medium py-2">마지막 업데이트</th>
              <th className="px-4 text-gray-500 font-medium py-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {dataUpdateList.map(({ type, time }) => (
              <tr key={type}>
                <td className="px-4 py-2 border-b border-gray-200">{type}</td>
                <td className="px-4 py-2 border-b border-gray-200">{time}</td>
                <td className="px-4 py-2 border-b border-gray-200">
                  <button className="text-gray-500 hover:underline cursor-pointer">업데이트</button>
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
