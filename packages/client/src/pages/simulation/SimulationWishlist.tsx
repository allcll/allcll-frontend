import NothingTable from '@/components/simulation/table/NothingTable';
import { Helmet } from 'react-helmet';

const SimulationWishlist = () => {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 시뮬레이션 관심 과목</title>
      </Helmet>

      <section className="border p-2 text-xs">
        <div className="flex flex-col gap-4">
          <div className="flex gap-8 h-10"></div>

          <div className="flex justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">검색구분</span>
                <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>주전공검색</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">주전공검색</span>
                <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>학부</option>
                </select>
                <select className="cursor-pointer border px-2 py-1 w-120 border-gray-300 bg-white" onChange={() => {}}>
                  <option value="none">전체 학과</option>
                </select>
              </div>
            </div>
            <button className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-800 cursor-pointer">검색</button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-5 ">
        <div>
          <div className="font-semibold pl-2 mb-2 border-l-4 border-blue-500">관심과목 대상 교과목</div>
          <div className="overflow-x-scroll min-h-[1000px] border-gray-300">
            <table className="min-w-[1200px] text-center border border-gray-300 border-t-3 border-t-black text-xs">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    '순번',
                    '신청',
                    '학수번호',
                    '분반',
                    '개설학과',
                    '교과목명',
                    '수업계획서',
                    '강의언어',
                    '학점/이론/실습',
                    '이수',
                    '학년',
                    '시간표',
                    '인원보기',
                  ].map((h, i) => (
                    <th key={i} className="border border-gray-300 px-2 py-1 ">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <NothingTable />
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="overflow-x-auto min-h-[1000px] border-gray-300">
            <div className="flex flex-row gap-3 items-center pl-2 mb-2 border-l-4 border-blue-500">
              <p className="font-semibold">관심과목 내역</p>
              <button className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-xs cursor-pointer">재조회</button>
              <button className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-xs cursor-pointer">
                관심과목 목록
              </button>
              <button className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-xs cursor-pointer">
                예상시간표
              </button>
            </div>

            <div className="flex gap-4 w-full mb-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold whitespace-nowrap">등록 가능 학점</span>
                <input
                  type="text"
                  disabled
                  value="24"
                  className="w-full px-4 py-1 border border-gray-300 rounded bg-white-100 text-center"
                />
              </div>

              <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold whitespace-nowrap">등록과목수:</span>
                <input
                  type="text"
                  disabled
                  value=""
                  className="w-full px-4 py-1 border border-gray-300 rounded bg-white-100 text-center"
                />
              </div>

              <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold whitespace-nowrap">등록학점:</span>
                <input
                  type="text"
                  disabled
                  value=""
                  className="w-full px-4 py-1 border border-gray-300 rounded bg-white-100 text-center"
                />
              </div>
            </div>

            <table className="min-w-[1200px] text-center border border-gray-300 border-t-3 border-t-black text-xs">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    '순번',
                    '삭제',
                    '폐강여부',
                    '재수강',
                    '학수번호',
                    '분반',
                    '개설학과',
                    '교과목명',
                    '수업계획서',
                    '강의언어',
                    '학점/이론/실습',
                    '이수',
                    '학년',
                    '시간표',
                    '인원보기',
                  ].map((h, i) => (
                    <th key={i} className="border border-gray-300 px-2 py-1">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={13} className="text-gray-400 py-4">
                    <div className="min-h-[500px] flex items-center justify-center ">
                      <p className="bg-stone-100 px-4 py-1 border">조회된 내역이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default SimulationWishlist;
