import { Badge, Card } from '@allcll/allcll-ui';
import { DetailRow } from './LogDetail';
import { AdminApiLogs } from '@/utils/dbConfig';

function LogItem({ log }: { log: AdminApiLogs }) {
  return (
    <Card key={log.request_id}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={log.statusCode === 200 ? 'success' : 'danger'}>{log.statusCode}</Badge>
          <p className="text-sm text-gray-800">{log.request_url}</p>
        </div>

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
      </div>
    </Card>
  );
}

export default LogItem;
