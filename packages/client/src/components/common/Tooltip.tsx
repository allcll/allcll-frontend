import React from 'react';
import TooltipSvg from '@/assets/tooltip.svg?react';

interface TooltipProps {
  children: React.ReactNode;
}

function Tooltip({ children }: TooltipProps) {
  return (
    <div className="relative inline-block">
      <span className="group inline-block">
        <TooltipSvg className="w-4 h-4" />
        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white p-3 rounded w-64 text-center pointer-events-none">
          {children}
        </span>
      </span>
    </div>
  );
}

export default Tooltip;
