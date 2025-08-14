import { useAdminSession } from '@/hooks/server/session/useAdminSession';
import CustomButton from '@allcll/common/components/Button';
import Card from '@allcll/common/components/Card';
const tokenKeys = ['tokenJ', 'tokenU', 'tokenR', 'tokenL'];

function SessionAdmin() {
  const { data, isFetching, refetch } = useAdminSession();

  return (
    <section>
      <Card>
        <h3 className="text-lg font-semibold mb-3">인증정보 조회</h3>
        <p className="text-sm text-gray-500 mb-4">현재 설정된 인증 정보를 조회합니다.</p>

        <div className="flex gap-2 mb-4">
          <CustomButton onClick={() => refetch()} variants="secondary" disabled={isFetching}>
            {isFetching ? '조회 중…' : '인증정보 조회'}
          </CustomButton>
        </div>

        <div className="bg-gray-100 text-sm text-gray-700 px-4 py-3 rounded-md space-y-1">
          {tokenKeys.map(key => (
            <p key={key}>
              토큰 {key}: <span className="font-mono break-all">{data ? data[key] : '[데이터 없음]'}</span>
            </p>
          ))}
        </div>
      </Card>
    </section>
  );
}

export default SessionAdmin;
