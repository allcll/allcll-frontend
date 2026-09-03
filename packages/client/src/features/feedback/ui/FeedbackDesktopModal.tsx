import { Dialog, Heading } from '@allcll/allcll-ui';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { FeedbackViewProps } from './FeedbackViewProps';

export default function FeedbackDesktopModal({
  success,
  rate,
  setRate,
  detail,
  setDetail,
  error,
  isPending,
  canSubmit,
  onClose,
  onDontShowAgain,
  onSubmit,
  titles,
}: FeedbackViewProps) {
  return (
    <div className="fixed bottom-6 right-6 z-floating">
      <div className="w-80 bg-white rounded-2xl shadow-lg">
        {!success ? (
          <>
            <Dialog.Header onClose={onClose}>
              <Heading level={3} size="xl" className="font-bold">
                {titles.title}
              </Heading>
            </Dialog.Header>

            <Dialog.Content>
              <FeedbackFields
                titles={titles}
                rate={rate}
                setRate={setRate}
                detail={detail}
                setDetail={setDetail}
                error={error}
              />
            </Dialog.Content>

            <Dialog.Footer>
              <FeedbackActions
                isPending={isPending}
                canSubmit={canSubmit}
                onDontShowAgain={onDontShowAgain}
                onSubmit={onSubmit}
              />
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
