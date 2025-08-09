import Card from '@allcll/common/components/Card';
import Toggle from '../common/Toggle';
import CustomButton from '@allcll/common/components/Button';

const getResponseType = ['Baskets', 'Preseats', 'Subjects', 'Department'];

function Control() {
  return (
    <Card>
      <h3 className="text-md font-semibold mb-3">크롤러 실행 제어</h3>
      <p className="text-sm text-gray-500 mb-4">크롤러의 특정 기능을 제어하고 데이터를 업데이트합니다.</p>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">인증정보 갱신 기능</span>
          <Toggle checked={true} onChange={() => {}} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">여석 크롤링</span>
          <Toggle checked={false} onChange={() => {}} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {getResponseType.map(label => (
          <CustomButton onClick={() => {}} variants="secondary" className="w-full">
            {label} 업데이트
          </CustomButton>
        ))}
      </div>
    </Card>
  );
}

export default Control;
