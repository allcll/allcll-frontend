import { AdminApiLogs } from '@/utils/dbConfig';
import LogItem from './LogItem';
import { Flex, Heading, SupportingText } from '@allcll/allcll-ui';

interface ILogList {
  logs: AdminApiLogs[];
}

function LogList({ logs }: ILogList) {
  return (
    <div className="min-h-0 px-2 overflow-y-auto touch-auto flex flex-col">
      <Heading level={3}>로그 목록</Heading>
      <SupportingText>시스템 로그를 확인할 수 있습니다.</SupportingText>

      <div className="overflow-y-hidden p-2 rounded-md bg-gray-200 shadow-sm">
        <Flex direction="flex-col" gap="gap-4">
          {logs.map(log => (
            <LogItem key={log.request_id} log={log} />
          ))}
        </Flex>
      </div>
    </div>
  );
}

export default LogList;
