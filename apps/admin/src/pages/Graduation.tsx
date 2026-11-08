import PageHeader from '@/components/common/PageHeader';
import GraduationSync from '@/components/graduation/GraduationSync';
import { ToastNotification } from '@allcll/common';

function Graduation() {
  return (
    <>
      <ToastNotification />

      <PageHeader title="졸업요건 설정" description="졸업요건 관련 설정을 변경합니다." />

      <main className="space-y-5">
        <GraduationSync />
      </main>
    </>
  );
}

export default Graduation;
