import LogList from '@/components/apiLogs/LogList';
import RequestLogs from '@/components/apiLogs/RequestLogs';
import { AdminApiLogs } from '@/utils/dbConfig';
import { filterRequestLogs } from '@/utils/log/adminApiLogs';
import { Heading, SupportingText } from '@allcll/allcll-ui';
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
    <div className="p-6 space-y-10">
      <Heading level={3}>로그 설정</Heading>
      <SupportingText>로그 페이지입니다.</SupportingText>

      <RequestLogs
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        selectedStatusCodes={selectedStatusCodes}
        setSelectedStatusCodes={setSelectedStatusCodes}
      />
      <LogList logs={logs} />
    </div>
  );
}

export default Logs;
