import LogList from '@/components/apiLogs/LogList';
import RequestLogs from '@/components/apiLogs/RequestLogs';
import PageHeader from '@/components/common/PageHeader';
import { AdminApiLogs } from '@/utils/dbConfig';
import { filterRequestLogs } from '@/utils/log/adminApiLogs';
import { useEffect, useState } from 'react';

function Logs() {
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<number[]>([-1]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [logs, setLogs] = useState<AdminApiLogs[]>([]);

  const normalizeCodes = (codes: number[]) => {
    if (codes.includes(0)) return [0, 200, 400, 500, 401, 403, 404];
    return codes;
  };

  const getLogs = async () => {
    filterRequestLogs(normalizeCodes(selectedStatusCodes), urlInput).then(logs => {
      if (!logs) return;
      setLogs(logs);
    });
  };

  useEffect(() => {
    getLogs().then();
  }, [selectedStatusCodes, urlInput]);

  return (
    <>
      <PageHeader title="API 요청 로그" description="API 요청 로그를 필터링하여 조회합니다." />

      <main className="space-y-5">
        <RequestLogs
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          selectedStatusCodes={selectedStatusCodes}
          setSelectedStatusCodes={setSelectedStatusCodes}
        />
        <LogList logs={logs} />
      </main>
    </>
  );
}

export default Logs;
