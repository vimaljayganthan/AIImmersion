import React, { useState } from 'react';

export interface DonutCategory {
  id: string;
  name: string;
  value: number;
  color: string; // e.g., '#3B82F6', '#10B981', '#F59E0B'
  percentage?: number;
}

export interface DonutDistributionChartProps {
  title?: string;
  subtitle?: string;
  categories: DonutCategory[];
  totalLabel?: string;
  unit?: string;
  onCategoryClick?: (category: DonutCategory) => void;
  selectedCategoryId?: string;
}

export const DonutDistributionChart: React.FC<DonutDistributionChartProps> = ({
  title,
  subtitle,
  categories,
  totalLabel = 'Total',
  unit = '',
  onCategoryClick,
  selectedCategoryId,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totalValue = categories.reduce((sum, c) => sum + c.value, 0) || 1;

  // Calculate angles for donut SVG paths
  const size = 180;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 24;

  let accumulatedAngle = 0;
  const slices = categories.map((cat) => {
    const percentage = (cat.value / totalValue) * 100;
    const angle = (cat.value / totalValue) * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle += angle;

    return {
      ...cat,
      percentage: Math.round(percentage),
      startAngle,
      endAngle,
    };
  });

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    // If arc is full 360, slightly adjust to prevent SVG arc closure glitch
    const adjustedEnd = endAngle - startAngle >= 360 ? startAngle + 359.99 : endAngle;
    const start = polarToCartesian(x, y, r, adjustedEnd);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = adjustedEnd - startAngle <= 180 ? '0' : '1';

    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const activeCategory =
    categories.find((c) => c.id === (hoveredId || selectedCategoryId)) || null;

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Donut Canvas + Center Stat */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
        <div className="relative w-[180px] h-[180px] shrink-0">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90 select-none">
            {slices.map((slice) => {
              const isHovered = hoveredId === slice.id || selectedCategoryId === slice.id;
              const pathD = describeArc(center, center, radius, slice.startAngle, slice.endAngle);

              return (
                <path
                  key={slice.id}
                  d={pathD}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer opacity-90 hover:opacity-100"
                  onMouseEnter={() => setHoveredId(slice.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onCategoryClick?.(slice)}
                />
              );
            })}
          </svg>

          {/* Centered Total / Active Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {activeCategory ? activeCategory.name : totalLabel}
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {activeCategory ? `${activeCategory.value}${unit}` : `${totalValue}${unit}`}
            </span>
            {activeCategory && (
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded mt-0.5">
                {Math.round((activeCategory.value / totalValue) * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Legend Grid */}
        <div className="w-full sm:w-auto flex flex-col gap-1.5 text-xs">
          {categories.map((cat) => {
            const isSelected = hoveredId === cat.id || selectedCategoryId === cat.id;
            const pct = Math.round((cat.value / totalValue) * 100);

            return (
              <div
                key={cat.id}
                onClick={() => onCategoryClick?.(cat)}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100/90 border-slate-300 font-bold shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-800 text-xs font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-900 font-bold">{cat.value}</span>
                  <span className="text-slate-400 text-[10px]">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
