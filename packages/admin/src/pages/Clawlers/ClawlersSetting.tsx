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

function CrawlerSettings() {
  /**
   * 인증 정보 세팅 여부에 대한 상태가 존재해야한다.
   *세션 갱신 API 응답 받기
   *isActive 된 인증정보 리스트 보여주기
   *그래도 할 것인가?
   */

  /**
   * CASE 1 : 로컬에서 인증 정보 세팅 -> 그래야지 크롤러 제어 가능
   * CASE 2 : 로컬에서 인증 정보 미세팅 -> 인증 정보 세팅 되어 있는 리스트 노출
   * */

  const { data: sessionStatus } = useCheckAdminSession();
  const userId = getSessionConfig()?.userId;
  const mySessionStatus = sessionStatus?.find(status => status.userId === userId);

  const isSessionSet = mySessionStatus?.isActive;

  return (
    <div className="p-6 space-y-10">
      <TostNotification />

      <h1 className="text-lg text-gray-700 font-bold mb-4">크롤러 설정</h1>
      <SetupProgress current={isSessionSet ? SetupStep.CONTROL : SetupStep.TOKEN} />
      <div className="flex flex-col gap-4">
        {!isSessionSet ? (
          <>
            <TokenSetting />
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
