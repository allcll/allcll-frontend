import 'react-datepicker/dist/react-datepicker.css';
import { Dispatch, SetStateAction } from 'react';
import MultiSelectFilterOption, { OptionType } from '../common/MultiSelectFilterOption';
import { Card, Flex, Heading, Label, SupportingText, TextField } from '@allcll/allcll-ui';
import Filtering from '@allcll/common/components/filtering/Filtering';
import CheckboxAdapter from '@allcll/common/components/checkbox/CheckboxAdapter';

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
  const setFilterScheduleWrapper = (value: number[]) => {
    setSelectedStatusCodes(value);
  };

  return (
    <section className="sticky top-16">
      <Card>
        <Card.Header>
          <Heading level={3}>API 요청 로그</Heading>
          <SupportingText>API 요청 로그를 필터링하여 조회합니다.</SupportingText>
        </Card.Header>

        <Card.Content>
          <Label id="filtering-option" className="font-semibold">
            필터링 옵션
          </Label>
          <Flex direction="flex-col" gap="gap-1" className="w-30">
            <Filtering label="상태" selected={selectedStatusCodes.length !== 0}>
              <MultiSelectFilterOption
                labelPrefix="상태 코드"
                selectedValues={selectedStatusCodes}
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
