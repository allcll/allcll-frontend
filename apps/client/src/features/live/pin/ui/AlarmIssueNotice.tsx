import { Button, Flex, WarningIcon } from '@allcll/allcll-ui';
import useNotificationInstruction from '@/features/notification/model/useNotificationInstruction.ts';
import { AlarmNotification } from '@/features/notification/lib/useNotification.ts';
import BrowserNotification from '@/features/notification/lib/browserNotification.ts';

interface AlarmIssue {
  message: string;
  showGuide?: boolean;
}

function getAlarmIssues(): AlarmIssue[] {
  const browserBlocked = BrowserNotification.canNotify() ? BrowserNotification.getDeniedMessage() : [];

  return AlarmNotification.getDeniedMessage().map(message =>
    browserBlocked.includes(message)
      ? { message: '브라우저 알림이 꺼져 있어 알림을 받을 수 없어요', showGuide: true }
      : { message },
  );
}

function AlarmIssueNotice({ isAlarm }: Readonly<{ isAlarm: boolean }>) {
  // 권한 변화를 다시 그리는 계기로만 씀. 문구는 알림 종류별로 따로 모음
  useNotificationInstruction(state => state.isPermitted);
  const openGuide = useNotificationInstruction(state => state.open);

  const issues = isAlarm ? getAlarmIssues() : [];
  if (issues.length === 0) return null;

  return (
    <ul className="mb-4 rounded-md border border-danger-200 dark:border-danger-500/40 bg-danger-subtle px-3 divide-y divide-danger-200">
      {issues.map(({ message, showGuide }) => (
        <li key={message}>
          <Flex align="center" gap={2} className="min-h-9 py-1">
            <WarningIcon aria-hidden="true" className="w-4 h-4 shrink-0 text-danger-700 dark:text-danger-400" />
            <span className="flex-1 text-xs leading-5 text-danger-700 dark:text-danger-400 break-keep">{message}</span>
            {showGuide && (
              <Button variant="outlined" color="gray" size="xsmall" className="shrink-0" onClick={openGuide}>
                설정 방법
              </Button>
            )}
          </Flex>
        </li>
      ))}
    </ul>
  );
}

export default AlarmIssueNotice;
