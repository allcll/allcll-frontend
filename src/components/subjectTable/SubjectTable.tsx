const TableHeadTitles = [
  {title: '핀', key: 'pin'},
  {title: '과목코드', key: 'code'},
  {title: '과목명', key: 'name'},
  {title: '담당교수', key: 'professor'},
  {title: '학점', key: 'credits'}
];

const DummyTableData = [
  {code: 'HU301', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 20},
  {code: 'HU302', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 15},
  {code: 'HU303', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 10},
  {code: 'HU304', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 9},
  {code: 'HU305', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 3},
];

function SubjectTable() {
  return (
    <table className="w-full bg-white rounded-lg">
      <thead>
      <tr className="bg-gray-50">
        {TableHeadTitles.map(({title}) => (
          <th key={title} className="px-4 py-2">{title}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {DummyTableData.map((subject) => (
        <TableRow key={`${subject.code} ${subject.name} ${subject.professor}`} subject={subject}/>
      ))}
      </tbody>
    </table>
  )
}

function TableRow({subject} : {subject: any}) {
  return (
    <tr className="border-t border-gray-200 text-black">
      <td className="px-4 py-2 text-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer" disabled={true}>
          핀
        </button>
      </td>
      <td className="px-4 py-2 text-center">{subject.code}</td>
      <td className="px-4 py-2 text-center">{subject.name}</td>
      <td className="px-4 py-2 text-center">{subject.professor}</td>
      <td className="px-4 py-2 text-center">{subject.credits}</td>
    </tr>
  )
}

export default SubjectTable;