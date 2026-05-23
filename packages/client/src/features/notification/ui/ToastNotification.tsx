import { useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createPortal } from 'react-dom';
import CloseSvg from '@/assets/x-gray.svg?react';
import AlarmSvg from '@/assets/alarm.svg?react';
import useToastNotification, { IToastMessage } from '../model/useToastNotification';

function ToastNotification() {
  const messages = useToastNotification(state => state.messages);
  const closeToast = useToastNotification(state => state.clearToast);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const popover = popoverRef.current;

    if (popover && 'showPopover' in popover && !popover.matches(':popover-open')) {
      popover.showPopover();
    }
  }, []);

  return createPortal(
    <div ref={popoverRef} popover="manual" className="toast-popover-root">
      <div className="fixed top-2 right-2 z-400 max-w-screen">
        <TransitionGroup className="flex gap-2 flex-col-reverse">
          {messages.slice(-3).map(message => (
            <CSSTransition key={message.id} timeout={300} classNames="toast">
              <Toast toast={message} closeToast={() => closeToast(message.id)} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>,
    document.body,
  );
}

interface IToast {
  toast: IToastMessage;
  closeToast: () => void;
}

function Toast({ toast, closeToast }: IToast) {
  return (
    <div className="flex justify-between items-center gap-2 p-4 ml-2 bg-white text-black rounded-lg shadow-md">
      <AlarmSvg className="w-4 h-4 text-blue-500" />
      <span className="flex-1 text-sm font-bold truncate max-w-72">{toast.message}</span>
      <button aria-label="닫기" onClick={closeToast} className="p-2 rounded-full hover:bg-blue-100">
        <CloseSvg />
      </button>
    </div>
  );
}

export default ToastNotification;
