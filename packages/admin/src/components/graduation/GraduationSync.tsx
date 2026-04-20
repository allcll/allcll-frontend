import { Button, Card } from '@allcll/allcll-ui';
import SectionHeader from '@/components/common/SectionHeader';
import useGraduationSync from '@/hooks/server/graduation/useGraduationSync';

function GraduationSync() {
  const { mutate: sync, isPending } = useGraduationSync();

  const handleSync = () => {
    if (!window.confirm('구글 시트 데이터를 DB에 동기화하시겠습니까?')) return;
    sync();
  };

  return (
    <Card>
      <SectionHeader
        title="구글 시트 동기화"
        description="구글 시트에 적재된 졸업요건 데이터를 DB와 동기화합니다."
      />

      <Button onClick={handleSync} variant="outlined" size="medium" disabled={isPending}>
        {isPending ? '동기화 중...' : '졸업요건 데이터 동기화'}
      </Button>
    </Card>
  );
}

export default GraduationSync;
