import { Day, Grade } from '@/utils/types';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import Chip from '@/components/common/Chip';

const GRADES: Grade[] = [1, 2, 3, 4];
const DAYS: Day[] = ['월', '화', '수', '목', '금'];

function FilteringBottomSheet() {
  return (
    <BottomSheet>
      <BottomSheetHeader headerType="close" onClose={() => {}} />

      <h2 className="font-semibold py-2 mt-2 text-sm border-b border-gray-200">필터링</h2>

      <form className="w-full  flex flex-col gap-2">
        <div className="w-full h-15 flex gap-2 flex flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">학과</label>
          <Chip label="학과" chipType="select" />
        </div>

        <div className="w-full h-15 flex gap-2 flex flex-col justify-center">
          <label className="text-xs text-gray-500">학년</label>
          <div className="flex gap-2">
            <Chip label="전체" selected />
            {GRADES.map(grade => {
              return <Chip label={`${grade}학년`} />;
            })}
          </div>
        </div>

        <div className="w-full h-15 flex gap-2 flex flex-col justify-center">
          <label className="text-xs text-gray-500">전공</label>
          <div className="flex gap-2">
            <Chip label="전공" />
            <Chip label="비전공" />
          </div>
        </div>

        <div className="w-full h-15 flex gap-2 flex flex-col justify-center">
          <label className="text-xs text-gray-500">요일</label>
          <div className="flex gap-2">
            <Chip label="전체" />
            {DAYS.map(day => {
              return <Chip label={day} />;
            })}
          </div>
        </div>
      </form>
    </BottomSheet>
  );
}

export default FilteringBottomSheet;
