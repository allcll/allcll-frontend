import { createPortal } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Branch as DismissableLayerBranch } from '@radix-ui/react-dismissable-layer';
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

  return createPortal(
    // 토스트를 눌러도 열린 모달, 시트가 바깥 클릭으로 닫히지 않도록 Radix 레이어의 일부로 등록
    <DismissableLayerBranch className="fixed top-2 right-2 z-toast max-w-screen pointer-events-auto">
      <TransitionGroup className="flex gap-2 flex-col-reverse">
        {messages.slice(-3).map(message => (
          <CSSTransition key={message.id} timeout={300} classNames={TOAST_TRANSITION}>
            <Toast message={message.message} onClose={() => closeToast(message.id)} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </DismissableLayerBranch>,
    document.body,
  );
}

export default ToastNotification;
