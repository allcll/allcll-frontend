import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createPortal } from 'react-dom';
import CloseSvg from '@/assets/x-gray.svg?react';
import AlarmSvg from '@/assets/alarm.svg?react';
import useToastNotification, { IToastMessage } from '../model/useToastNotification';

function ToastNotification() {
  const messages = useToastNotification(state => state.messages);
  const closeToast = useToastNotification(state => state.clearToast);
  const portalTarget = getToastPortalTarget();

  return createPortal(
    <div className="fixed top-2 right-2 z-400 max-w-screen">
      <TransitionGroup className="flex gap-2 flex-col-reverse">
        {messages.slice(-3).map(message => (
          <CSSTransition key={message.id} timeout={300} classNames="toast">
            <Toast toast={message} closeToast={() => closeToast(message.id)} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>,
    portalTarget,
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

function getToastPortalTarget() {
  const popoverRoot = getToastPopoverRoot();

  if (popoverRoot) {
    return popoverRoot;
  }

  return document.body;
}

function getToastPopoverRoot() {
  const id = 'toast-popover-root';
  let root = document.getElementById(id);

  if (!root) {
    root = document.createElement('div');
    root.id = id;
    root.setAttribute('popover', 'manual');
    root.className = 'toast-popover-root';
    document.body.appendChild(root);
  }

  if ('showPopover' in root && !root.matches(':popover-open')) {
    root.showPopover();
  }

  return root;
}
