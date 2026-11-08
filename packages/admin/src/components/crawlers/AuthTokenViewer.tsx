import { useAdminSession } from '@/hooks/server/session/useAdminSession';
import { Button, Flex, Card } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
import { TOKEN_FIELDS } from '@/utils/type';

function AuthTokenViewer() {
  const { data, isFetching, refetch } = useAdminSession();

  return (
    <section>
      <Card>
        <SectionHeader title="인증정보 조회" description="현재 설정된 인증 정보를 조회합니다." />

        <div className="flex flex-col space-y-3 text-gray-600 text-sm">
          <Flex gap={2}>
            <Button onClick={() => refetch()} variant="outlined" color="gray" size="medium" disabled={isFetching}>
              {isFetching ? '조회 중…' : '인증정보 조회'}
            </Button>
          </Flex>

          <div className="bg-gray-100 w-full text-sm text-gray-700 px-4 py-3 rounded-md">
            {TOKEN_FIELDS.map(({ key, label }) => (
              <p key={key}>
                {label}: <span className="font-mono break-all">{data ? data[key] : '[데이터 없음]'}</span>
              </p>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

export default AuthTokenViewer;
