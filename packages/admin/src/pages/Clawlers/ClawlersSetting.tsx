import SessionAdmin from '@/components/clawlers/SessionAdmin';
import Control from '@/components/clawlers/Control';
import TostNotification from '@allcll/common/components/toast/ToastNotification';
import DepartmentControl from '@/components/clawlers/SubjectAndDepartmentControl';
import { useEffect, useState } from 'react';
import SetupProgress from './SetupProgress';
import { SetupStep } from '@/utils/type';

function CrawlerSettings() {
  /**
   * 인증 정보 세팅 여부에 대한 상태가 존재해야한다.
   *세션 갱신 API 응답 받기
   *isActive 된 인증정보 리스트 보여주기
   *그래도 할 것인가?
   */

  const [isSessionSet, setIsSessionSet] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="p-6 space-y-10">
      <TostNotification />

      <h1 className="text-lg text-gray-700 font-bold mb-4">크롤러 설정</h1>

      <div className="flex flex-col gap-4">
        <SetupProgress current={isSessionSet ? SetupStep.CONTROL : SetupStep.TOKEN} />

        <Control />
        <DepartmentControl />
        <SessionAdmin />
      </div>
    </div>
  );
}

export default CrawlerSettings;
