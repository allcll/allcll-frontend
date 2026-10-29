import { SetupStep } from '@/utils/type';
import { Flex } from '@allcll/allcll-ui';
import { Step, Line } from '@allcll/common';

function SetupProgress({ current }: { current: number }) {
  return (
    <Flex align="items-center">
      <Step
        number={SetupStep.TOKEN}
        finish={current > SetupStep.TOKEN}
        active={current >= SetupStep.TOKEN}
        label="인증 정보 세팅"
      />
      <Line active={current >= SetupStep.CONTROL} />
      <Step
        number={SetupStep.CONTROL}
        finish={current > SetupStep.CONTROL}
        active={current >= SetupStep.CONTROL}
        label="크롤러 제어"
      />
    </Flex>
  );
}

export default SetupProgress;
