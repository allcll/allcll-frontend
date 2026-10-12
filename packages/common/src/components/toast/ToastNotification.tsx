import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Toast } from '@allcll/allcll-ui';
import useToastNotification from '../../store/useToastNotification';

const TOAST_TRANSITION = {
  enter: 'opacity-0 translate-x-full',
  enterActive: '!opacity-100 !translate-x-0 transition-[opacity,translate] duration-300',
  exitActive: 'opacity-0 translate-x-full transition-[opacity,translate] duration-300',
};

function ToastNotification() {
  const messages = useToastNotification(state => state.messages);
  const closeToast = useToastNotification(state => state.clearToast);
  const popoverRef = useRef<HTMLDivElement>(null);

  // popover(top layer)로 띄워야 열린 Dialog(<dialog> top layer) 위에도 토스트가 보임
  useEffect(() => {
    const popover = popoverRef.current;

    if (popover && 'showPopover' in popover && !popover.matches(':popover-open')) {
      popover.showPopover();
    }
  }, []);

  return createPortal(
    <div
      ref={popoverRef}
      popover="manual"
      className="m-0 p-0 border-0 bg-transparent overflow-visible pointer-events-none backdrop:hidden"
    >
      <div className="fixed top-2 right-2 z-toast max-w-screen pointer-events-auto">
        <TransitionGroup className="flex gap-2 flex-col-reverse">
          {messages.slice(-3).map(message => (
            <CSSTransition key={message.id} timeout={300} classNames={TOAST_TRANSITION}>
              <Toast message={message.message} onClose={() => closeToast(message.id)} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>,
    document.body,
  );
}

export default ToastNotification;
