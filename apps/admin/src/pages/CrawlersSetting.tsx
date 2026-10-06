import SessionAdmin from '@/components/crawlers/AuthTokenViewer';
import Control from '@/components/crawlers/Control';
import CrawlerControl from '@/components/crawlers/CrawlerControlComponent';
import { ToastNotification } from '@allcll/common';
import { SetupStep } from '@/utils/type';
import SetupProgress from '../components/crawlers/SetupProgress';
import TokenSetting from '@/components/crawlers/AuthTokenSetting';
import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { getSessionConfig } from '@/utils/sessionConfig';
import SessionList from '@/components/dashboard/SessionList';
import { Flex } from '@allcll/allcll-ui';
import PageHeader from '@/components/common/PageHeader';
import UpdateData from '@/components/crawlers/UpdateData';

function CrawlerSettings() {
  const { data: sessionStatus } = useCheckAdminSession();
  const userId = getSessionConfig()?.userId;
  const mySessionStatus = sessionStatus?.find(status => status.userId === userId);

  const isCredentialRegistered = !!mySessionStatus;

  return (
    <>
      <ToastNotification />

      <PageHeader title="크롤러 설정" description="크롤러 관련 설정을 변경합니다." />

      <main className="space-y-5">
        <SetupProgress current={isCredentialRegistered ? SetupStep.CONTROL : SetupStep.TOKEN} />

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
              <CrawlerControl />
              <UpdateData />
            </>
          )}
        </Flex>
      </main>
    </>
  );
}

export default CrawlerSettings;
