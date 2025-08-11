import 'react-datepicker/dist/react-datepicker.css';
import { Dispatch, SetStateAction } from 'react';
import Filtering from '@allcll/common/components/filtering/Filtering';
import Card from '@allcll/common/components/Card';
import Checkbox from '@allcll/common/components/filtering/Checkbox';
import { Status } from '@/pages/Logs';

const statusCodes = [
  { label: '전체', value: 0 },
  { label: '200 OK', value: 200 },
  { label: '400 Bad Request', value: 400 },
  { label: '401 Unauthorized', value: 401 },
  { label: '403 Forbidden', value: 403 },
  { label: '404 Not Found', value: 404 },
  { label: '500 Internal Server Error', value: 500 },
];

interface IRequestLogs {
  urlInput: string;
  setUrlInput: Dispatch<SetStateAction<string>>;
  selectedStatusCode: Status | null;
  setSelectedStatusCode: Dispatch<SetStateAction<Status | null>>;
}

function RequestLogs({ urlInput, setUrlInput, selectedStatusCode, setSelectedStatusCode }: IRequestLogs) {
  return (
    <section className="sticky top-16">
      <Card>
        <h2 className="text-md font-semibold mb-3">API 요청 로그</h2>
        <p className="text-gray-600 mb-4">API 요청 로그를 필터링하여 조회합니다.</p>

        <div className="w-full gap-4  justify-between max-w-3xl mx-auto space-y-4">
          <label className="block text-sm font-medium mb-1">상태 코드</label>

          <Filtering
            label={selectedStatusCode?.label ?? '상태 코드를 선택해주세요.'}
            selected={statusCodes.length > 0}
            className="gap-4 max-h-80 overflow-y-auto"
          >
            {statusCodes.length === 0 && <div> 새로운 상태 코드를 추가해주세요.</div>}
            {statusCodes.length !== 0 &&
              statusCodes.map(option => (
                <div className="flex gap-5" key={option.value}>
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    isChecked={selectedStatusCode === option}
                    onChange={() => setSelectedStatusCode(option)}
                  />
                </div>
              ))}
          </Filtering>

          <label className="block text-sm font-medium mb-1">API 요청 URL</label>
          <input
            type="text"
            value={urlInput}
            placeholder="API 요청 URL을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            onChange={e => {
              setUrlInput(e.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
}

export default RequestLogs;
