import { Flex, SupportingText } from '@allcll/allcll-ui';

interface LoadingProps {
  message?: string;
}

const LoadingWithMessage = ({ message }: LoadingProps) => {
  return (
    <Flex
      flex-direction="column"
      justify-content="center"
      align-item="center"
      style={{
        height: '100%',
      }}
    >
      <Flex direction="flex-col" align="items-center" justify="justify-center">
        <LogoSpinner />
        <p className="font-semibold text-lg">{message || '로딩 중이에요'}</p>
        <SupportingText>잠시만 기다려 주세요.</SupportingText>
      </Flex>
    </Flex>
  );
};

function LogoSpinner() {
  return (
    <>
      <img
        src="/ci.svg"
        alt="Loading"
        style={{
          width: 80,
          height: 80,
          animation: 'spin 1.5s linear infinite',
        }}
      />
      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
    </>
  );
}

export default LoadingWithMessage;
