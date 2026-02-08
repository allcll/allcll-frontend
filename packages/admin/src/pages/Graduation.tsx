import PageHeader from '@/components/common/PageHeader';
import GraduationSync from '@/components/graduation/GraduationSync';
import TostNotification from '@allcll/common/components/toast/ToastNotification';

function Graduation() {
  return (
    <>
      <TostNotification />

      <PageHeader title="졸업요건 설정" description="졸업요건 관련 설정을 변경합니다." />

      <main className="space-y-5">
        <GraduationSync />
      </main>
    </>
  );
}

export default Graduation;
