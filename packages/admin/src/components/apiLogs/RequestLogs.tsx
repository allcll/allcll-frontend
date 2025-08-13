import 'react-datepicker/dist/react-datepicker.css';
import { Dispatch, SetStateAction } from 'react';
import Card from '@allcll/common/components/Card';
import CheckboxFilter, { OptionType } from '@allcll/common/components/filtering/CheckboxFilter';

const StatusCodes: OptionType<number>[] = [
  { id: 0, label: 0 },
  { id: 2, label: 200 },
  { id: 3, label: 400 },
  { id: 4, label: 401 },
  { id: 5, label: 403 },
  { id: 6, label: 404 },
  { id: 7, label: 500 },
];

interface IRequestLogs {
  urlInput: string;
  setUrlInput: Dispatch<SetStateAction<string>>;
  selectedStatusCodes: number[];
  setSelectedStatusCodes: Dispatch<SetStateAction<number[]>>;
}

function RequestLogs({ urlInput, setUrlInput, selectedStatusCodes, setSelectedStatusCodes }: IRequestLogs) {
  const handleChangeCheckbox = (item: number) => {
    const checkedAllItems = selectedStatusCodes.length === StatusCodes.length;

    if (item === 0) {
      const updateStatusCodes = checkedAllItems ? [] : StatusCodes.map(status => status.id);

      setSelectedStatusCodes(updateStatusCodes);

      return;
    }

    const checked = selectedStatusCodes.includes(item);
    const updateStatusCodes = checked
      ? selectedStatusCodes.filter(statusCode => statusCode !== item)
      : [...selectedStatusCodes, item];

    setSelectedStatusCodes(updateStatusCodes);
  };

  return (
    <section className="sticky top-16">
      <Card>
        <h2 className="text-md font-semibold mb-3">API 요청 로그</h2>
        <p className="text-gray-600 mb-4">API 요청 로그를 필터링하여 조회합니다.</p>

        <div className="w-full gap-4  justify-between max-w-3xl mx-auto space-y-4">
          <label className="block text-sm font-medium mb-1">상태 코드</label>

          <CheckboxFilter
            labelPrefix=" 코드"
            selectedItems={selectedStatusCodes}
            handleChangeCheckbox={handleChangeCheckbox}
            options={StatusCodes}
            selected={selectedStatusCodes.length !== 0}
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
