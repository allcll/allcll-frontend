import React from 'react';
import TooltipSvg from '@/assets/help-circle.svg?react';
import IconButton from '../icon-button/IconButton';

interface ITooltip {
  children: React.ReactNode;
}

function Tooltip({ children }: ITooltip) {
  return (
    <div className="relative inline-block">
      <div className="group inline-block">
        <IconButton
          label="Tooltip"
          variant="plain"
          icon={<TooltipSvg className="w-6 h-6 text-gray-400 background-gray-200" />}
        />

        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white p-3 rounded w-64 text-center pointer-events-none">
          {children}
        </span>
      </div>
    </div>
  );
}

export default Tooltip;
