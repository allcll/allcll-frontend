import 'react-datepicker/dist/react-datepicker.css';
import SemesterSetting from '@/components/service/SemesterSetting';
import ServicePeriod from '@/components/service/ServicePeriod';
import PageHeader from '@/components/common/PageHeader';

function ServiceSettings() {
  return (
    <>
      <PageHeader title="서비스 설정" description="서비스 전반에 관한 설정을 변경합니다." />

      <main className="space-y-5">
        <SemesterSetting />
        <ServicePeriod />
      </main>
    </>
  );
}

export default ServiceSettings;
