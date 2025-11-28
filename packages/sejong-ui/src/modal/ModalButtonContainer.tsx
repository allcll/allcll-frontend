import type { ComponentPropsWithoutRef } from 'react';

interface ModerButtonContainerProps extends ComponentPropsWithoutRef<'div'> {}

function ModalButtonContainer({ children, className = '', ...rest }: ModerButtonContainerProps) {
  const fixedClassName = 'flex justify-end gap-4 w-full ' + className;
  return (
    <div className={fixedClassName} {...rest}>
      {children}
    </div>
  );
}

export default ModalButtonContainer;
