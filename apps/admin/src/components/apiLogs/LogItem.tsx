import { Badge, Card, Flex } from '@allcll/allcll-ui';
import { DetailRow } from './LogDetail';
import { AdminApiLogs } from '@/utils/dbConfig';

function LogItem({ log }: { log: AdminApiLogs }) {
  return (
    <Card key={log.request_id}>
      <Flex direction="flex-col" gap="gap-3">
        <Flex>
          <Badge variant={log.statusCode === 200 ? 'success' : 'danger'}>{log.statusCode}</Badge>
          <p className="text-sm text-gray-800">{log.request_url}</p>
        </Flex>
        <DetailRow label="메서드">
          <span className="text-md text-blue-500">{log.method}</span>
        </DetailRow>
        <DetailRow label="요청시간">{log.timestamp}</DetailRow>
        <DetailRow label="요청 Body">
          <span className="whitespace-pre-wrap">{JSON.stringify(log.request_body, null, 2)}</span>
        </DetailRow>
        <DetailRow label="응답값">
          <span className="whitespace-pre-wrap">{JSON.stringify(log.response_body, null, 2)}</span>
        </DetailRow>
      </Flex>
    </Card>
  );
}

export default LogItem;
