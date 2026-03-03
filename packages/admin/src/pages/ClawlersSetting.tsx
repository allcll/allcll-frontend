import SessionAdmin from '@/components/clawlers/AuthTokenViewer';
import Control from '@/components/clawlers/Control';
import { ToastNotification as TostNotification } from '@allcll/common';
import DepartmentControl from '@/components/clawlers/SubjectAndDepartmentControl';
import { SetupStep } from '@/utils/type';
import SetupProgress from '../components/clawlers/SetupProgress';
import TokenSetting from '@/components/clawlers/AuthTokenSetting';
import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { getSessionConfig } from '@/utils/sessionConfig';
import SessionList from '@/components/dashboard/SessionList';
import { Flex } from '@allcll/allcll-ui';
import PageHeader from '@/components/common/PageHeader';
import UpdateData from '@/components/clawlers/UpdateData';

function CrawlerSettings() {
  const { data: sessionStatus } = useCheckAdminSession();
  const userId = getSessionConfig()?.userId;
  const mySessionStatus = sessionStatus?.find(status => status.userId === userId);

  const isSessionSet = mySessionStatus?.isActive ?? false;

  return (
    <>
      <TostNotification />

      <PageHeader title="크롤러 설정" description="크롤러 관련 설정을 변경합니다." />

      <main className="space-y-5">
        <SetupProgress current={isSessionSet ? SetupStep.CONTROL : SetupStep.TOKEN} />

        <Flex direction="flex-col" gap="gap-4">
          {!mySessionStatus ? (
            <>
              <TokenSetting />
              <SessionList />
            </>
          ) : (
            <>
              <SessionAdmin />
              <Control />
              <DepartmentControl />
              <UpdateData />
            </>
          )}
        </Flex>
      </main>
    </>
  );
}

export default CrawlerSettings;
