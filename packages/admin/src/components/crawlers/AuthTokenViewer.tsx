import { useAdminSession } from '@/hooks/server/session/useAdminSession';
import { Button, Flex, Card } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
const tokenKeys = ['tokenJ', 'tokenU', 'tokenR', 'tokenL'];

function AuthTokenViewer() {
  const { data, isFetching, refetch } = useAdminSession();

  return (
    <section>
      <Card>
        <SectionHeader title="인증정보 조회" description="현재 설정된 인증 정보를 조회합니다." />

        <Card.Content>
          <Flex gap="gap-2">
            <Button onClick={() => refetch()} variant="outlined" size="medium" disabled={isFetching}>
              {isFetching ? '조회 중…' : '인증정보 조회'}
            </Button>
          </Flex>

          <div className="bg-gray-100 w-full text-sm text-gray-700 px-4 py-3 rounded-md">
            {tokenKeys.map(key => (
              <p key={key}>
                토큰 {key}: <span className="font-mono break-all">{data ? data[key] : '[데이터 없음]'}</span>
              </p>
            ))}
          </div>
        </Card.Content>
      </Card>
    </section>
  );
}

export default AuthTokenViewer;
