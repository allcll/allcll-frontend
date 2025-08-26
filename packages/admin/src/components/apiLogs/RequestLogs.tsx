import 'react-datepicker/dist/react-datepicker.css';
import { Dispatch, SetStateAction } from 'react';
import Card from '@allcll/common/components/Card';
import MultiCheckboxFilter from '@allcll/common/components/filtering/MultiCheckboxFilter';
import { OptionType } from '@allcll/common/components/filtering/MultiCheckboxFilter';
import CheckboxAdapter from '@allcll/common/components/checkbox/CheckboxAdapter';

const StatusCodes: OptionType<number>[] = [
  { value: 200, label: '200' },
  { value: 400, label: '400' },
  { value: 401, label: '401' },
  { value: 403, label: '403' },
  { value: 404, label: '404' },
  { value: 500, label: '500' },
];

interface IRequestLogs {
  urlInput: string;
  setUrlInput: Dispatch<SetStateAction<string>>;
  selectedStatusCodes: number[];
  setSelectedStatusCodes: Dispatch<SetStateAction<number[]>>;
}

function RequestLogs({ urlInput, setUrlInput, selectedStatusCodes, setSelectedStatusCodes }: Readonly<IRequestLogs>) {
  const setFilterScheduleWrapper = (field: string, value: number[]) => {
    if (field === 'selectedStatusCodes') {
      setSelectedStatusCodes(value);
    }
  };

  return (
    <section className="sticky top-16">
      <Card>
        <h2 className="text-md font-semibold mb-3">API 요청 로그</h2>
        <p className="text-gray-600 mb-4">API 요청 로그를 필터링하여 조회합니다.</p>

        <div className="w-full gap-4  justify-between max-w-3xl mx-auto space-y-4">
          <label className="block text-sm font-medium mb-1">상태 코드</label>

          <MultiCheckboxFilter
            labelPrefix="상태 코드"
            selectedValues={selectedStatusCodes}
            field="selectedStatusCodes"
            setFilterSchedule={setFilterScheduleWrapper}
            options={StatusCodes}
            selected={selectedStatusCodes.length !== 0}
            ItemComponent={CheckboxAdapter}
          />

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
