import React from 'react';

interface NoneLayoutProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

function NoneLayout({ icon, title, description, children }: Readonly<NoneLayoutProps>) {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-50 rounded-md">
      <div className="flex flex-col items-center justify-center gap-2 p-12">
        <div>{icon}</div>
        <div className="text-gray-600">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
        {children}
      </div>
    </div>
  );
}

export default NoneLayout;
