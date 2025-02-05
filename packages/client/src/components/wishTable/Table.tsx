import {Link} from 'react-router-dom';
import {Wishes} from '@/utils/types..ts';
import useFavorites from '@/store/useFavorites.ts';
import StarIcon from '@/components/svgs/StarIcon.tsx';

interface ITable {
  data: Wishes[];
}

export const TableHeaders = [
  {name: '즐겨찾기', key: ''},
  {name: '학수번호', key: 'subjectCode'},
  {name: '분반', key: 'classCode'},
  {name: '개설 학과', key: 'departmentCode'},
  {name: '과목명', key: 'subjectName'},
  {name: '교수명', key: 'professorName'},
  {name: '관심', key: 'totalCount'},
]

function Table({data}: ITable) {
  return (
    <table className="w-full bg-white rounded-lg">
      <thead>
      <tr className="bg-gray-50">
        {TableHeaders.map(({name}) => (
          <th key={name} className="px-4 py-2">{name}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {data.map((course: Wishes) => (
        <TableRow key={course.subjectId} data={course}/>

        // <tr key={course.subjectId}
        //     className="border-t border-gray-200 text-black hover:bg-gray-100">
        //   <td className="px-4 py-2 text-center">
        //       <button onClick={() =>
        //         setFavorite((prev) =>
        //           prev.includes(course.subjectId) ? prev.filter(id => id !== course.subjectId) : [...prev, course.subjectId]
        //         )
        //       }>
        //         <StarSvg
        //           className={`w-5 h-5 ${favorite.includes(course.subjectId) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}/>
        //       </button>
        //     </td>
        //     <td className="p-3">{course.subjectCode}</td>
        //     <td className="p-3">{course.classCode}</td>
        //     <td className="p-3">{course.departmentCode}</td>
        //     <td className="p-3">
        //       <Link to={`/wishes/${course.subjectId}`}>
        //         {course.subjectName}
        //       </Link>
        //     </td>
        //     <td className="p-3">{course.professorName}</td>
        //     <td className="p-3">
        //             <span
        //               className={`px-3 py-1 rounded-full text-white text-xs ${course.totalCount >= 40 ? 'bg-red-500' : 'bg-yellow-500'}`}>
        //               {course.totalCount}
        //             </span>
        //     </td>
        //     <td className="p-3">시간표</td>
        //   </tr>
      ))
      }
      </tbody>
    </table>
  );
}

function TableRow({data}: { data: Wishes }) {
  const isFavorite = useFavorites(state => state.isFavorite);
  const toggleFavorite = useFavorites(state => state.toggleFavorite);

  return (
    <tr className="border-t border-gray-200 text-black hover:bg-gray-100">
      <td className="px-4 py-2 text-center">
        <button onClick={() => toggleFavorite(data.subjectId)}>
          <StarIcon disabled={!isFavorite(data.subjectId)}/>
        </button>
      </td>

      {TableHeaders.slice(1, 10).map(({key}) => (
        <td className="px-4 py-2 text-center" key={key}>
          <Link to={`/wishes/${data.subjectId}`}>
            {key === '' ? '시간표' :
              key === 'totalCount' ? (
                <ColoredText wishCount={data.totalCount}/>
              ) : (
                data[key as keyof Wishes]?.toString()
              )}
          </Link>
        </td>
      ))}
    </tr>
  );
}

function ColoredText({wishCount}: { wishCount: number }) {
  let style = 'text-green-500 bg-green-100';

  if (wishCount >= 100) {
    style = 'text-red-500 bg-red-100';
  } else if (wishCount >= 50) {
    style = 'text-yellow-500 bg-yellow-100';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
    {wishCount}
  </span>
  );
}

export default Table;