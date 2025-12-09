import 'react-datepicker/dist/react-datepicker.css';
import SemesterSetting from '@/components/service/SemesterSetting';
import ServicePeriod from '@/components/service/ServicePeriod';
import { Heading } from '@allcll/allcll-ui';

function ServiceSettings() {
  return (
    <div className="p-6 space-y-10">
      <Heading size="large">서비스 설정</Heading>

      <SemesterSetting />
      <ServicePeriod />
    </div>
  );
}

export default ServiceSettings;
