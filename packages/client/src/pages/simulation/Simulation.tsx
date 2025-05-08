import UserWishModal from '@/components/simulation/modal/UserWishModal';
import WaitingModal from '@/components/simulation/modal/WaitingModal';
import SubjectsTable from '@/components/simulation/SubjectsTable';
import useDepartments from '@/hooks/server/useDepartments';
import { useSimulationModal } from '@/store/useSimulationModal';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

function Simulation() {
  const [department, setDepartment] = useState({
    departmentCode: '',
    departmentName: '',
  });
  const { type, props, openModal, closeModal } = useSimulationModal();

  const handleSearchClick = () => {
    /*
    1. 이름, 전화번호 POST 요청 보내기
    2. 학과 상태 저장 후 모달에 전달하기
    2번 먼저 구현 하기
    */
    openModal('wish', { department });
  };

  const { data: departments } = useDepartments();

  const handleChangeDepartment = (name: string) => {
    const selected = departments?.find(department => department.departmentName === name);
    if (selected) {
      setDepartment({
        departmentCode: selected.departmentCode,
        departmentName: selected.departmentName,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>ALLCLL | 시뮬레이션</title>
      </Helmet>

      {type === 'waiting' && <WaitingModal />}
      {type === 'wish' && <UserWishModal department={props.department} setIsModalOpen={() => closeModal()} />}

      <section className="border p-2 space-y-4 text-xs">
        <div>
          <div className="flex items-center gap-8 mb-4">
            <div className="flex items-center gap-2">
              <label className="font-bold">조직 분류</label>
              <select className="border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option></option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">년도/학기</label>
              <select className="border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option></option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-8 mb-2">
            <div className="flex items-center gap-2">
              <label className="font-bold">주전공(교직)</label>
              <select className="border px-2 py-1 w-48">
                <option>컴퓨터공학전공</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">복수전공(교직)</label>
              <select className="border px-2 py-1 w-48">
                <option>없음</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">학번</label>
              <input className="border px-2 py-1 w-48" placeholder="2022123456" />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">이름</label>
              <input className="border px-2 py-1 w-48" placeholder="홍길동" />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">전화번호</label>
              <input className="border px-2 py-1 w-48" placeholder="010-1234-5678" />
            </div>
          </div>

          <div className="flex items-center gap-8 justify-between">
            <div className="flex flex-row gap-2">
              <div className="flex items-center gap-2">
                <label className="font-bold">검색구분</label>
                <select className="border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>관심과목목록</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold">내학과</label>
                <select
                  className="border px-2 py-1 w-48"
                  value={department.departmentName}
                  onChange={e => handleChangeDepartment(e.target.value)}
                >
                  {departments?.map(department => (
                    <option key={department.departmentCode} value={department.departmentName}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end items-end">
              <button onClick={handleSearchClick} className="bg-gray-700 cursor-pointer text-white px-4 py-2 rounded">
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="overflow-x-auto">
        <div className="font-semibold pl-2 mb-2 border-l-4 border-blue-500">수강 대상 교과목</div>
        <table className="min-w-full text-center border border-gray-300 border-t-3 border-t-black text-xs">
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
                <th key={i} className="border border-gray-300 px-2 py-1">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <SubjectsTable />
        </table>
      </section>

      {/* 신청 내역 */}
      <section className="overflow-x-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold pl-2 border-l-4 border-blue-500">수강 신청 내역</span>
            <button className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">재조회</button>
          </div>
          <div className="text-xs font-bold text-black">
            수강 가능 학점: 18 / <span className="text-blue-500">신청 과목수: 4 / 신청 학점수: 10.5</span>
          </div>
        </div>
        <table className="min-w-full text-center border border-gray-300 border-t-3 border-t-black text-xs">
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
                <th key={i} className="border border-gray-300 px-2 py-1">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>
    </>
  );
}

export default Simulation;
