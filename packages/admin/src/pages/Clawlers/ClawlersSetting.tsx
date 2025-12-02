import SessionAdmin from '@/components/clawlers/SessionAdmin';
import Control from '@/components/clawlers/Control';
import TostNotification from '@allcll/common/components/toast/ToastNotification';
import DepartmentControl from '@/components/clawlers/SubjectAndDepartmentControl';
import { SetupStep } from '@/utils/type';
import SetupProgress from './SetupProgress';
import TokenSetting from '@/components/clawlers/TokenSetting';
import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { getSessionConfig } from '@/utils/sessionConfig';
import SessionList from '@/components/dashboard/SessionList';
import { useState } from 'react';

function CrawlerSettings() {
  const { data: sessionStatus } = useCheckAdminSession();
  const userId = getSessionConfig()?.userId;
  const mySessionStatus = sessionStatus?.find(status => status.userId === userId);

  const [isSessionSet, setIsSessionSet] = useState(mySessionStatus?.isActive ?? false);

  return (
    <div className="p-6 space-y-10">
      <TostNotification />

      <h1 className="text-lg text-gray-700 font-bold mb-4">크롤러 설정</h1>
      <SetupProgress current={isSessionSet ? SetupStep.CONTROL : SetupStep.TOKEN} />
      <div className="flex flex-col gap-4">
        {!isSessionSet ? (
          <>
            <TokenSetting setIsSessionSet={setIsSessionSet} />
            <SessionList />
          </>
        ) : (
          <>
            <SessionAdmin />
            <Control />
            <DepartmentControl />
          </>
        )}
      </div>
    </div>
  );
}

export default CrawlerSettings;
