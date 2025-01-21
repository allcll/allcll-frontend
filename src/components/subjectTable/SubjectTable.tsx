function SubjectTable() {
  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-100">
      <tr>
        <th className="p-4">핀</th>
        <th className="p-4">과목코드</th>
        <th className="p-4">과목명</th>
        <th className="p-4">담당교수</th>
        <th className="p-4">학점</th>
        <th className="p-4">여석</th>
        <th className="p-4">최근 갱신</th>
      </tr>
      </thead>
      <tbody>
      <tr className="border-b">
        <td className="p-4">📌</td>
        <td className="p-4">CS101</td>
        <td className="p-4">프로그래밍 기초</td>
        <td className="p-4">김교수</td>
        <td className="p-4">3</td>
        <td className="p-4 text-green-500">2</td>
        <td className="p-4">1분 전</td>
      </tr>
      <tr>
        <td className="p-4">📌</td>
        <td className="p-4">BA201</td>
        <td className="p-4">경영학원론</td>
        <td className="p-4">이교수</td>
        <td className="p-4">3</td>
        <td className="p-4 text-red-500">0</td>
        <td className="p-4">방금 전</td>
      </tr>
      </tbody>
    </table>
  )
}

export default SubjectTable;