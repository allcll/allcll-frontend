import { Dialog, Heading } from '@allcll/allcll-ui';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { FeedbackTitles } from '../lib/useFeedbackTitle';

type FeedbackDesktopModalProps = {
  success: boolean;
  rate: 0 | 1 | 2 | 3;
  setRate: (rate: 1 | 2 | 3) => void;
  detail: string;
  setDetail: (value: string) => void;
  error: string | null;
  isPending: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  onSubmit: () => void;
  titles: FeedbackTitles;
};

export default function FeedbackDesktopModal({
  success,
  rate,
  setRate,
  detail,
  setDetail,
  error,
  isPending,
  onClose,
  onDontShowAgain,
  onSubmit,
  titles,
}: FeedbackDesktopModalProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-80 bg-white rounded-2xl shadow-lg">
        {!success ? (
          <>
            <Dialog.Header onClose={onClose}>
              <Heading level={3} size="xl" className="font-bold">
                {titles.title}
              </Heading>
            </Dialog.Header>

            <Dialog.Content>
              <FeedbackFields titles={titles} rate={rate} setRate={setRate} detail={detail} setDetail={setDetail} error={error} />
            </Dialog.Content>

            <Dialog.Footer>
              <FeedbackActions isPending={isPending} onDontShowAgain={onDontShowAgain} onSubmit={onSubmit} />
            </Dialog.Footer>
          </>
        ) : (
          <Dialog.Content>
            <FeedbackSuccess />
          </Dialog.Content>
        )}
      </div>
    </div>
  );
}
