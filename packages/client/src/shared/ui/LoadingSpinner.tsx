import { colors } from '@allcll/allcll-ui';
import { ClipLoader } from 'react-spinners';

function LoadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center z-[12] bg-[rgba(93,92,92,0.05)]">
      {children}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <LoadingLayout>
      <ClipLoader color={colors.primary[500]} size="60px" aria-label="Loading Spinner" data-testid="loader" />
      <p></p>
    </LoadingLayout>
  );
}

export default LoadingSpinner;
