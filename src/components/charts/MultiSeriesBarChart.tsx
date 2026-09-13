import React, { useState } from 'react';

export type TimeRange = '7D' | '30D' | '6M';

export interface MultiSeriesBarDataPoint {
  label: string;
  series: Record<string, number>;
}

export interface SeriesMeta {
  key: string;
  label: string;
  color: string;
}

export interface MultiSeriesBarChartProps {
  title?: string;
  subtitle?: string;
  dataSets: Record<TimeRange, MultiSeriesBarDataPoint[]>;
  series: SeriesMeta[];
  initialRange?: TimeRange;
  height?: number;
  badgeText?: string;
  isStacked?: boolean;
  onRangeChange?: (range: TimeRange) => void;
}

export const MultiSeriesBarChart: React.FC<MultiSeriesBarChartProps> = ({
  title,
  subtitle,
  dataSets,
  series,
  initialRange = '30D',
  height = 240,
  badgeText,
  isStacked = true,
  onRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialRange);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const currentData = dataSets[selectedRange] || dataSets['30D'] || [];

  // Calculate max Y value
  const maxValues = currentData.map((d) => {
    if (isStacked) {
      return series.reduce((sum, s) => sum + (d.series[s.key] || 0), 0);
    }
    return Math.max(...series.map((s) => d.series[s.key] || 0));
  });

  const maxY = Math.ceil((Math.max(...maxValues, 10) * 1.15) / 5) * 5;
  const svgWidth = 600;
  const svgHeight = height;
  const paddingLeft = 36;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 32;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const groupWidth = chartWidth / Math.max(1, currentData.length);
  const barWidth = Math.min(28, groupWidth * 0.55);

  const gridLines = [0, 0.33, 0.66, 1].map((ratio) => {
    const val = Math.round((1 - ratio) * maxY);
    const y = paddingTop + ratio * chartHeight;
    return { val, y };
  });

  const handleRangeSelect = (r: TimeRange) => {
    setSelectedRange(r);
    setHoveredIdx(null);
    onRangeChange?.(r);
  };

  const activeItem = hoveredIdx !== null && currentData[hoveredIdx] ? currentData[hoveredIdx] : null;

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header with Title and Range Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {badgeText && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/70">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Range Selector */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600 shadow-2xs">
          {(['7D', '30D', '6M'] as TimeRange[]).map((range) => {
            const labels: Record<TimeRange, string> = {
              '7D': '7 Days',
              '30D': '30 Days',
              '6M': '6 Months',
            };
            const isSelected = selectedRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => handleRangeSelect(range)}
                className={`px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {labels[range]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-2">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Grid lines */}
          {gridLines.map((gl, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={gl.y}
                x2={svgWidth - paddingRight}
                y2={gl.y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={gl.y + 3.5}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono font-medium"
              >
                {gl.val}
              </text>
            </g>
          ))}

          {/* Bars Rendering */}
          {currentData.map((d, idx) => {
            const centerX = paddingLeft + idx * groupWidth + groupWidth / 2;
            const startX = centerX - barWidth / 2;
            const isHovered = hoveredIdx === idx;

            let currentY = paddingTop + chartHeight;

            return (
              <g key={idx}>
                {/* Background column highlight on hover */}
                {isHovered && (
                  <rect
                    x={paddingLeft + idx * groupWidth}
                    y={paddingTop}
                    width={groupWidth}
                    height={chartHeight}
                    fill="#F1F5F9"
                    opacity="0.6"
                    rx={6}
                  />
                )}

                {/* Stacked Bars */}
                {series.map((s, sIdx) => {
                  const val = d.series[s.key] || 0;
                  const segmentHeight = (val / maxY) * chartHeight;
                  const segY = currentY - segmentHeight;
                  currentY = segY;

                  const isTopSegment = sIdx === series.length - 1;

                  return (
                    <rect
                      key={s.key}
                      x={startX}
                      y={segY}
                      width={barWidth}
                      height={Math.max(0, segmentHeight)}
                      fill={s.color}
                      rx={isTopSegment ? 4 : 0}
                      className="transition-all duration-150"
                      opacity={isHovered ? 1 : 0.88}
                    />
                  );
                })}

                {/* X-Axis Label */}
                <text
                  x={centerX}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold transition-colors ${
                    isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {d.label}
                </text>

                {/* Transparent hover hit target */}
                <rect
                  x={paddingLeft + idx * groupWidth}
                  y={paddingTop}
                  width={groupWidth}
                  height={chartHeight + 15}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {activeItem && hoveredIdx !== null && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900/95 backdrop-blur-xs text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700/60 z-20 transition-all duration-100 min-w-[140px]"
            style={{
              left: `${
                ((paddingLeft + hoveredIdx * groupWidth + groupWidth / 2) / svgWidth) * 100
              }%`,
              top: '30%',
            }}
          >
            <div className="font-bold text-white mb-1 border-b border-slate-700 pb-1">
              {activeItem.label} Summary
            </div>
            {series.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.label}:</span>
                </div>
                <span className="font-bold font-mono text-white">
                  {activeItem.series[s.key] || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
