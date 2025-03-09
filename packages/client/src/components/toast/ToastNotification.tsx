import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useToastNotification, { IToastMessage } from '@/store/useToastNotification.ts';
import CloseSvg from '@/assets/x-gray.svg?react';
import AlarmSvg from '@/assets/alarm-blue.svg?react';

function ToastNotification() {
  const messages = useToastNotification((state) => state.messages);
  const closeToast = useToastNotification((state) => state.clearToast);

  return (
    <div className='fixed top-2 right-2 z-100 max-w-screen'>
      <TransitionGroup className='flex gap-2 flex-col-reverse'>
        {messages.slice(-3).map((message, index) => (
          <CSSTransition key={`${index} : ${message}`} timeout={300} classNames='toast'>
            <Toast toast={message} closeToast={() => closeToast(index)} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  )
}

interface IToast {
  toast: IToastMessage;
  closeToast: () => void;
}

function Toast({ toast, closeToast }: IToast) {
  return (
    <div className='flex justify-between items-center gap-2 p-4 ml-2 bg-white text-black rounded-lg shadow-md'>
      <AlarmSvg className="w-4 h-4"/>
      <span className='flex-1 text-sm font-bold truncate max-w-72'>
        {toast.message}
      </span>
      <button aria-label='닫기' onClick={closeToast} className='p-2 rounded-full hover:bg-blue-100'>
        <CloseSvg/>
      </button>
    </div>
  )
}

export default ToastNotification;