import CardWrap from '@/components/CardWrap.tsx';
import useSoyungDepartments from '@/hooks/server/useSoyungDepartments.ts';
import {SSEType, useSseData} from '@/hooks/useSSE.ts';
import {QueryClient} from '@tanstack/react-query';
import useWishes from '@/hooks/server/useWishes.ts';

interface IRealtimeTable {
  title: string;
  showSelect?: boolean;
}

const TableHeadTitles = [
  {title: '과목코드', key: 'code'},
  {title: '과목명', key: 'name'},
  {title: '담당교수', key: 'professor'},
  {title: '여석', key: 'seats'}
];

// const DummyTableData = [
//   {code: 'HU301', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 20},
//   {code: 'HU302', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 15},
//   {code: 'HU303', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 10},
//   {code: 'HU304', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 9},
//   {code: 'HU305', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 3},
//   {code: 'HU301', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 20},
//   {code: 'HU302', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 15},
//   {code: 'HU303', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 10},
//   {code: 'HU304', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 9},
//   {code: 'HU305', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 3},
// ];

const RealtimeTable = ({title='교양과목', showSelect=false}: IRealtimeTable) => {
  // major list API fetch
  // subject list SSE API fetch
  const {data: departments} = useSoyungDepartments();
  const sseType = title === '교양과목' ? SSEType.NON_MAJOR : SSEType.MAJOR;
  const {data: subjectIds} = useSseData(new QueryClient(), sseType);
  const {data: subjectData} = useWishes();

  const tableData = subjectIds?.map((subject) => {
    const {subjectId, seat} = subject;
    const {subjectName, subjectCode, professorName} = subjectData?.find((subject) => subject.subjectId === subjectId) || {};
    return {code: subjectCode, name: subjectName, professor: professorName, seat};
  }) ?? [];

  const setMajor = (departmentId: number) => {
    fetch('/api/set-major', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({departmentId}),
    }).then();
  }

  const onChangeDepartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    if (departmentId) {
      setMajor(Number(departmentId));
    }
  }

  return (
    <CardWrap>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg p-2">{title} 실시간</h2>
        {showSelect && (
          <select className="border border-gray-300 rounded px-4 py-2"
                  onChange={onChangeDepartment}>
            {departments && departments.map((department) => (
              <option key={department.departmentId}>{department.departmentName}</option>
            ))}
          </select>
        )}
      </div>
      <table className="w-full bg-white rounded-lg">
        <thead>
        <tr className="bg-gray-50">
          {TableHeadTitles.map(({title}) => (
            <th key={title} className="px-4 py-2">{title}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {tableData.map((subject, index) => (
          <SubjectRow key={index} subject={subject}/>
        ))}
        </tbody>
      </table>
    </CardWrap>
  );
};

function SubjectRow({subject}: {subject: any}) {
  return (
    <tr className="border-t border-gray-200">
      {TableHeadTitles.map(({key}) =>
        key == 'seats' ? (
        <td key={key} className="px-4 py-2 text-center">
          <p className={'rounded-full ' + seatColor(subject[key])}>
            {subject[key]}
          </p>
        </td>
      ) : (
          <td key={key} className="px-4 py-2 text-center">{subject[key]}</td>
        )
      )}
    </tr>
  );
}

export function seatColor(seats: number) {
  if (seats > 5)
    return 'text-green-500 bg-green-100';
  if (seats > 0)
    return 'text-yellow-500 bg-yellow-100';

  return 'text-red-500 bg-red-100';
}

export default RealtimeTable;
