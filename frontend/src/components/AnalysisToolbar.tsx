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
    <div className="flex flex-col gap-6 w-full items-center">
      {tools.map(tool => (
        <div key={tool.label} className="relative group flex justify-center w-full">
          <button
            disabled={disabled}
            onClick={() => onAction(tool.id, tool.target)}
            className={`p-3.5 rounded-2xl transition-all flex items-center justify-center
              ${disabled 
                ? 'text-slate-300 cursor-not-allowed bg-transparent' 
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 active:scale-95 hover:shadow-sm'
              }`}
          >
            {tool.icon}
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-[70px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50">
            {tool.label}
          </div>
        </div>
      ))}
    </div>
  );
}
