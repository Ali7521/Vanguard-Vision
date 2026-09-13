import React from 'react';
import { BoxSelect, Map, Activity, Car, Trees, Ship } from 'lucide-react';

interface Props {
  onAction: (module: string, target?: string) => void;
  disabled: boolean;
}

export default function AnalysisToolbar({ onAction, disabled }: Props) {
  const tools = [
    {
      id: 'object_detection',
      target: 'building',
      icon: <BoxSelect size={22} />,
      label: 'Detect Buildings'
    },
    {
      id: 'object_detection',
      target: 'vehicle',
      icon: <Car size={22} />,
      label: 'Detect Vehicles'
    },
    {
      id: 'object_detection',
      target: 'tree',
      icon: <Trees size={22} />,
      label: 'Locate Trees'
    },
    {
      id: 'land_cover',
      icon: <Map size={22} />,
      label: 'Land Cover Segmentation'
    },
    {
      id: 'ndvi',
      icon: <Activity size={22} />,
      label: 'NDVI Vegetation Index'
    },
    {
      id: 'ndwi',
      icon: <Ship size={22} />,
      label: 'NDWI Water Index'
    }
  ];

  return (
    <div className="flex flex-row lg:flex-col gap-2 lg:gap-4 w-full px-2 lg:px-0">
      {tools.map(tool => (
        <button
          key={tool.label}
          onClick={() => onAction(tool.id, tool.target)}
          disabled={disabled}
          title={tool.label}
          className={`
            p-2 lg:p-3 rounded-xl flex items-center justify-center shrink-0
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'hover:bg-blue-50 text-slate-600 hover:text-blue-600 hover:shadow-sm'}
            transition-all duration-200
          `}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
