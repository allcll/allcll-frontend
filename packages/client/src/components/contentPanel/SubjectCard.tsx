interface ISubjectCard {
  isActive?: boolean;
}

export function SubjectCards() {
  return (
    <div className="w-full flex flex-col gap-1">
      <SubjectCard isActive={true} />
      <SubjectCard isActive={true} />
      <SubjectCard />
      <SubjectCard />
    </div>
  );
}

function SubjectCard({ isActive }: ISubjectCard) {
  const color = isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-700 bg-whtie';

  return (
    <div className={`border-gray-200 rounded-lg border-1 cursor-pointer p-4 gap-3 flex flex-col ${color}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">알고리즘</h3>
        <span className="text-sm text-gray-500">교수명</span>
      </div>
      <span className="text-sm text-gray-500 ">강의시간/강의실</span>
      <div className="flex justify-between">
        <div
          className={`w-fit rounded-xl flex items-center text-gray-500 text-xs ${isActive ? 'bg-none' : 'bg-gray-100 px-2.5 py-0.5 '}`}
        >
          학점:3
        </div>
        {isActive && (
          <button className="bg-blue-500 border-none cursor-pointer rounded-xl px-2.5 py-1 text-white text-xs hover:bg-blue-600">
            추가하기
          </button>
        )}
      </div>
    </div>
  );
}
