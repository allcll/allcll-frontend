import CustomButton from '@allcll/common/components/Button';
import Card from '@allcll/common/components/Card';
import InfoChip from '@allcll/common/components/chip/InfoChip';

function SessionAdmin() {
  return (
    <section>
      <Card>
        <h3 className="text-md font-semibold mb-3">인증정보 조회</h3>
        <p className="text-sm text-gray-500 mb-4">현재 설정된 인증 정보를 조회합니다.</p>
        <div className="flex gap-2 mb-4">
          <CustomButton onClick={() => {}} variants="secondary">
            인증정보 조회
          </CustomButton>
          <CustomButton onClick={() => {}} variants="secondary">
            인증정보 갱신
          </CustomButton>
        </div>
        <div className="bg-gray-100 text-sm text-gray-700 px-4 py-3 rounded-md">
          <p>
            토큰 J: <span className="font-mono">[토큰 J 값]</span>
          </p>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-3">인증정보 갱신 실행 여부</h3>
          <InfoChip label="OPEN" type="success" />
        </div>
      </Card>
    </section>
  );
}

export default SessionAdmin;
