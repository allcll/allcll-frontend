import React from 'react';

interface BlurProps {
  children: React.ReactNode;
}

function BlurComponents({children}: BlurProps) {
  return (
    <div className="relative">
      <div style={{filter: "blur(4px"}}>
        {children}
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <p className="text-xl font-bold text-gray-700">추후 제공 예정</p>
      </div>
    </div>
  );
}

export default BlurComponents;