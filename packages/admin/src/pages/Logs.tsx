import LogList from '@/components/logs/LogList';
import RequestLogs from '@/components/logs/RequestLogs';
import { AdminApiLogs } from '@/utils/dbConfig';
import { getRequestLogs } from '@/utils/log/adminApiLogs';
import { useEffect, useState } from 'react';

export interface Status {
  label: string;
  value: string;
}

function Logs() {
  const [selectedStatusCode, setSelectedStatusCode] = useState({
    label: '200 OK',
    value: '200',
  });

  const [logs, setLogs] = useState<AdminApiLogs[]>([]);

  const getLogs = async () => {
    getRequestLogs().then(logs => {
      if (!logs) {
        return;
      }
      setLogs(logs);
    });
  };

  useEffect(() => {
    getLogs();
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-lg text-gray-700 font-bold mb-4">로그 설정</h1>
      <p className="text-gray-600">로그 페이지입니다.</p>

      <RequestLogs selectedStatusCode={selectedStatusCode} setSelectedStatusCode={setSelectedStatusCode} />
      <LogList logs={logs} setLogs={setLogs} />
    </div>
  );
}

export default Logs;
