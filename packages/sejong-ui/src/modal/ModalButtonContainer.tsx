import { HTMLAttributes } from 'react';

interface ModerButtonContainerProps extends HTMLAttributes<HTMLDivElement> {}

function ModalButtonContainer({ children, className = '', ...rest }: ModerButtonContainerProps) {
  const fixedClassName = 'flex justify-end gap-4 w-full ' + className;
  return (
    <div className={fixedClassName} {...rest}>
      {children}
    </div>
  );
}

export default ModalButtonContainer;
