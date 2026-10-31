import useConfirm, { settleConfirm } from '../../store/useConfirm';
import ConfirmDialog from './ConfirmDialog';

function GlobalConfirmDialog() {
  const request = useConfirm(state => state.request);

  return (
    <ConfirmDialog
      isOpen={!!request}
      title={request?.title ?? ''}
      description={request?.description ?? ''}
      confirmLabel={request?.confirmLabel}
      cancelLabel={request?.cancelLabel}
      danger={request?.danger}
      onConfirm={() => settleConfirm(true)}
      onClose={() => settleConfirm(false)}
    />
  );
}

export default GlobalConfirmDialog;
