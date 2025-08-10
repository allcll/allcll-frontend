import LogList from '@/components/logs/LogList';
import RequestLogs from '@/components/logs/RequestLogs';
import { AdminApiLogs } from '@/utils/dbConfig';
import { filterRequestLogs } from '@/utils/log/adminApiLogs';
import { useEffect, useState } from 'react';

export interface Status {
  label: string;
  value: number;
}

function Logs() {
  const [selectedStatusCode, setSelectedStatusCode] = useState<Status | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [logs, setLogs] = useState<AdminApiLogs[]>([]);

  const getLogs = async () => {
    filterRequestLogs(selectedStatusCode?.value, urlInput).then(logs => {
      if (!logs) {
        return;
      }
      setLogs(logs);
    });
  };

  useEffect(() => {
    getLogs();
  }, [selectedStatusCode, urlInput]);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-lg text-gray-700 font-bold mb-4">로그 설정</h1>
      <p className="text-gray-600">로그 페이지입니다.</p>

      <RequestLogs
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        selectedStatusCode={selectedStatusCode}
        setSelectedStatusCode={setSelectedStatusCode}
      />
      <LogList logs={logs} />
    </div>
  );
}

export default Logs;
