import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import type { BoundingBox, Polygon } from '../App';

interface Props {
  imageUrl: string;
  boxes: BoundingBox[];
  polygons?: Polygon[];
}

export default function ImageViewer({ imageUrl, boxes, polygons = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const updateDimensions = () => {
    if (imgRef.current && containerRef.current) {
      const img = imgRef.current;
      const container = containerRef.current;
      
      const renderedWidth = img.width;
      const renderedHeight = img.height;
      
      if (renderedWidth === 0 || renderedHeight === 0) return;
      
      const x = (container.clientWidth - renderedWidth) / 2;
      const y = (container.clientHeight - renderedHeight) / 2;
      
      setDimensions({ width: renderedWidth, height: renderedHeight, x: Math.max(0, x), y: Math.max(0, y) });
    }
  };

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [imageUrl]);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-gray-900 overflow-hidden" ref={containerRef}>
      <img 
        ref={imgRef}
        src={imageUrl} 
        alt="Satellite view" 
        className="max-w-full max-h-full object-contain"
        onLoad={updateDimensions}
      />
      
      {/* SVG Overlay for Polygons */}
      {dimensions.width > 0 && polygons.length > 0 && (
        <svg 
          className="absolute pointer-events-none z-10" 
          style={{ 
            left: dimensions.x, 
            top: dimensions.y, 
            width: dimensions.width, 
            height: dimensions.height 
          }}
        >
          {polygons.map((poly, idx) => {
            const pointsStr = poly.points.map(
              p => `${p[0] * dimensions.width},${p[1] * dimensions.height}`
            ).join(" ");
            
            return (
              <g key={`poly-${idx}`} className="group pointer-events-auto cursor-pointer">
                <polygon 
                  points={pointsStr} 
                  fill={poly.color} 
                  stroke={poly.color.replace(/[\d.]+\)$/, '1)')}
                  strokeWidth="2"
                  className="transition-opacity hover:opacity-80"
                />
                <text 
                  x={poly.points[0][0] * dimensions.width} 
                  y={poly.points[0][1] * dimensions.height - 10} 
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                >
                  {poly.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Box Overlays */}
      {dimensions.width > 0 && boxes.map((item, idx) => {
        const [xMin, yMin, xMax, yMax] = item.box;
        
        const left = dimensions.x + (xMin * dimensions.width);
        const top = dimensions.y + (yMin * dimensions.height);
        const width = (xMax - xMin) * dimensions.width;
        const height = (yMax - yMin) * dimensions.height;
        
        return (
          <div 
            key={`box-${idx}`}
            className="absolute border-2 border-red-500 bg-red-500/20 group z-20 pointer-events-auto cursor-pointer"
            style={{ left, top, width, height }}
          >
            <div className="absolute -top-6 left-[-2px] bg-red-500 text-white text-xs px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 font-medium rounded-t-sm shadow-sm">
              {item.label} {(item.confidence * 100).toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
