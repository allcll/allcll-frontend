import 'react-datepicker/dist/react-datepicker.css';
import SemesterSetting from '@/components/service/SemesterSetting';
import ServicePeriod from '@/components/service/ServicePeriod';
import CustomButton from '@allcll/common/components/Button';

function ServiceSettings() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-lg text-gray-700 font-bold mb-4">서비스 설정</h1>

      <SemesterSetting />
      <ServicePeriod />
      <div className="flex justify-end">
        <CustomButton variants="primary" onClick={() => {}}>
          전체 저장
        </CustomButton>
      </div>
    </div>
  );
}

export default ServiceSettings;
