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
                <label className="font-bold">검색구분</label>
                <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>주전공검색</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold">주전공검색</label>
                <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>학부</option>
                </select>
                <select className="cursor-pointer border px-2 py-1 w-120 border-gray-300 bg-white" onChange={() => {}}>
                  <option value="none">전체 학과</option>
                  {/* {newDepartments?.map(dept => (
                    <option key={dept.departmentCode} value={dept.departmentName}>
                      {dept.departmentName}
                    </option>
                  ))} */}
                </select>
              </div>
            </div>
            <button className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-800 cursor-pointer">검색</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SimulationWishlist;
