import React, { HTMLAttributes } from 'react';

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function Card({ children, className, ...props }: Readonly<ICardProps>) {
  return (
    <div className={'bg-white p-3 rounded-md text-sm shadow-md shadow-gray-300 ' + className} {...props}>
      {children}
    </div>
  );
}

export default Card;
