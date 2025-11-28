import IconButton from '../icon-button/IconButton';
import RowSlots from '../row/RowSlots';
import AlarmIcon from '../svgs/AlarmIcon';
import CloseSvg from '@/assets/x.svg?react';

export interface IToastMessage {
  message: string;
  tag?: string;
}

interface IToast {
  toast: IToastMessage;
  closeToast: () => void;
}

function Toast({ toast, closeToast }: IToast) {
  return (
    <RowSlots
      withPadding
      className="bg-white rounded-lg shadow-md"
      left={<AlarmIcon className="w-4 h-4" />}
      center={<span className="flex-1 text-sm font-bold truncate max-w-72">{toast.message}</span>}
      right={
        <IconButton
          label="닫기"
          variant="plain"
          icon={<CloseSvg className="text-gray-400 w-4 h-4 " />}
          className="p-2 rounded-full hover:bg-blue-100"
          onClick={closeToast}
        />
      }
    />
  );
}

export default Toast;
