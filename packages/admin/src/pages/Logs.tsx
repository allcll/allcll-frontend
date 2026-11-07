import { useEffect, useMemo, useState } from 'react';
import { Flex } from '@allcll/allcll-ui';
import { CheckboxAdapter, Filtering, formatMultiSelectedLabel } from '@allcll/common';
import LogList from '@/components/apiLogs/LogList';
import MultiSelectFilterOption from '@/components/common/MultiSelectFilterOption';
import PageHeader from '@/components/common/PageHeader';
import { AdminApiLogs } from '@/utils/dbConfig';
import { getRequestLogs } from '@/utils/log/adminApiLogs';

const getPath = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

function Logs() {
  const [logs, setLogs] = useState<AdminApiLogs[]>([]);
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<number[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

  useEffect(() => {
    void getRequestLogs().then(logs => setLogs(logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))));
  }, []);

  const statusOptions = useMemo(
    () =>
      [...new Set(logs.map(log => log.statusCode))]
        .sort((a, b) => a - b)
        .map(value => ({ label: String(value), value })),
    [logs],
  );

  const pathOptions = useMemo(
    () =>
      [...new Set(logs.map(log => getPath(log.request_url)))]
        .sort((a, b) => a.localeCompare(b))
        .map(value => ({ label: value, value })),
    [logs],
  );

  const filteredLogs = logs
    .filter(log => !selectedStatusCodes.length || selectedStatusCodes.includes(log.statusCode))
    .filter(log => !selectedPaths.length || selectedPaths.includes(getPath(log.request_url)));

  return (
    <>
      <PageHeader title="API 요청 로그" description="API 요청 로그를 필터링하여 조회합니다." />

      <main className="space-y-5">
        <Flex align="items-center" gap="gap-2">
          <Filtering
            label={formatMultiSelectedLabel('상태', selectedStatusCodes, String)}
            selected={selectedStatusCodes.length > 0}
          >
            <MultiSelectFilterOption
              labelPrefix="상태 코드"
              selectedValues={selectedStatusCodes}
              setFilter={setSelectedStatusCodes}
              options={statusOptions}
              ItemComponent={CheckboxAdapter}
            />
          </Filtering>
          <Filtering
            label={formatMultiSelectedLabel('URL', selectedPaths, path => path)}
            selected={selectedPaths.length > 0}
          >
            <MultiSelectFilterOption
              labelPrefix="API 요청 URL"
              selectedValues={selectedPaths}
              setFilter={setSelectedPaths}
              options={pathOptions}
              ItemComponent={CheckboxAdapter}
            />
          </Filtering>
        </Flex>
        <LogList logs={filteredLogs} />
      </main>
    </>
  );
}

export default Logs;
