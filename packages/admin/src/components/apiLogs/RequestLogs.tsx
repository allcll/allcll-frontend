import 'react-datepicker/dist/react-datepicker.css';
import { Dispatch, SetStateAction } from 'react';
import CheckboxAdapter from '@allcll/common/components/checkbox/CheckboxAdapter';
import Filtering from '@allcll/common/components/filtering/Filtering';
import MultiSelectFilterOption, { OptionType } from '../common/MultiSelectFilterOption';
import { Card, Flex, Heading, Label, SupportingText, TextField } from '@allcll/allcll-ui';

const StatusCodes: OptionType<number>[] = [
  { value: 0, label: 'ALL' },
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
        <Card.Header>
          <Heading level={3}>API 요청 로그</Heading>
          <SupportingText>API 요청 로그를 필터링하여 조회합니다.</SupportingText>
        </Card.Header>

        <Card.Content>
          <Flex direction="flex-col" gap="gap-1">
            <Label id="filtering-option" className="font-semibold">
              필터링 옵션
            </Label>
            <Filtering label="상태" selected={selectedStatusCodes.length !== 0}>
              <MultiSelectFilterOption
                labelPrefix="상태 코드"
                selectedValues={selectedStatusCodes}
                field="selectedStatusCodes"
                setFilter={setFilterScheduleWrapper}
                options={StatusCodes}
                ItemComponent={CheckboxAdapter}
              />
            </Filtering>
          </Flex>

          <TextField
            id="apiUrl"
            label="API 요청 URL"
            size="medium"
            placeholder="API 요청 URL을 입력하세요"
            value={urlInput}
            onChange={e => {
              setUrlInput(e.target.value);
            }}
          />
        </Card.Content>
      </Card>
    </section>
  );
}

export default RequestLogs;
