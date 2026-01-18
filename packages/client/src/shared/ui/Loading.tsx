import { Flex, SupportingText } from '@allcll/allcll-ui';

interface LoadingProps {
  message?: string;
}

const Loading = ({ message }: LoadingProps) => {
  return (
    <Flex
      flex-direction="column"
      justify-content="center"
      align-item="center"
      style={{
        height: '100%',
      }}
    >
      <SupportingText>{message || '로딩 중이에요'}</SupportingText>
      <SupportingText>잠시만 기다려 주세요.</SupportingText>
    </Flex>
  );
};

export default Loading;
