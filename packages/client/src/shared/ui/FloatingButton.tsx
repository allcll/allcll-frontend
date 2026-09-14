import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface IFloatingButtonProps extends ComponentPropsWithoutRef<'button'> {
  label: string;
  icon: ReactNode;
}

function FloatingButton({ label, icon, className = '', ...rest }: Readonly<IFloatingButtonProps>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`fixed bottom-19 md:bottom-21 right-4 md:right-6 z-floating w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg
                  flex justify-center items-center cursor-pointer transition-[opacity,background-color] duration-200 hover:bg-gray-50 ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}

export default FloatingButton;
