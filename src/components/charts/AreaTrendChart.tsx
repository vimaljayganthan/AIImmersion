import React, { useState } from 'react';

export type TimeRange = '7D' | '30D' | '6M' | '1Y';

export interface ChartDataPoint {
  label: string;
  value: number;
  sublabel?: string;
}

export interface AreaTrendChartProps {
  title?: string;
  subtitle?: string;
  dataSets: Record<TimeRange, ChartDataPoint[]>;
  initialRange?: TimeRange;
  color?: string; // e.g., '#0EA5E9' (Sky), '#10B981' (Emerald), '#6366F1' (Indigo)
  gradientId?: string;
  unit?: string;
  valuePrefix?: string;
  minY?: number;
  maxY?: number;
  height?: number;
  badgeText?: string;
  onRangeChange?: (range: TimeRange) => void;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  title,
  subtitle,
  dataSets,
  initialRange = '30D',
  color = '#0EA5E9',
  gradientId = 'trendGradient',
  unit = '',
  valuePrefix = '',
  minY,
  maxY,
  height = 240,
  badgeText,
  onRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialRange);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentData = dataSets[selectedRange] || dataSets['30D'] || [];
  const values = currentData.map((d) => d.value);

  const calculatedMin = minY !== undefined ? minY : Math.floor(Math.min(...values) * 0.9);
  const calculatedMax = maxY !== undefined ? maxY : Math.ceil(Math.max(...values) * 1.08) || 100;
  const rangeY = calculatedMax - calculatedMin || 1;

  const svgWidth = 600;
  const svgHeight = height;
  const paddingLeft = 36;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 32;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getCoordinates = (idx: number, val: number) => {
    const x = paddingLeft + (idx / Math.max(1, currentData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((val - calculatedMin) / rangeY) * chartHeight;
    return { x, y };
  };

  const points = currentData.map((d, i) => getCoordinates(i, d.value));

  // Build SVG Path with smooth curves (catmull-rom or bezier approximation)
  const buildSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    if (pts.length === 2) return `M ${pts[0].x},${pts[0].y} L ${pts[1].x},${pts[1].y}`;

    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${paddingTop + chartHeight} Z`
    : '';

  // 4 horizontal grid lines
  const gridLines = [0, 0.33, 0.66, 1].map((ratio) => {
    const val = Math.round(calculatedMin + (1 - ratio) * rangeY);
    const y = paddingTop + ratio * chartHeight;
    return { val, y };
  });

  const handleRangeSelect = (r: TimeRange) => {
    setSelectedRange(r);
    setHoveredIndex(null);
    onRangeChange?.(r);
  };

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;
  const activeData = hoveredIndex !== null && currentData[hoveredIndex] ? currentData[hoveredIndex] : null;

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header with Title, Badge, and Range Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {badgeText && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/70">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Time Filter Pill Selector */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600 shadow-2xs">
          {(['7D', '30D', '6M', '1Y'] as TimeRange[]).map((range) => {
            const labels: Record<TimeRange, string> = {
              '7D': '7 Days',
              '30D': '30 Days',
              '6M': '6 Months',
              '1Y': '1 Year',
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

      {/* Interactive SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="70%" stopColor={color} stopOpacity="0.06" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines & Y-Axis Labels */}
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
                {valuePrefix}{gl.val}{unit}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Spline Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-Axis Labels & Hover Interaction Columns */}
          {points.map((pt, idx) => {
            const item = currentData[idx];
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold transition-colors ${
                    isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {item.label}
                </text>

                {/* Point Marker */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill={isHovered ? '#ffffff' : color}
                  stroke={color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all duration-150"
                />

                {/* Vertical Cursor Line on Hover */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + chartHeight}
                    stroke={color}
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                    className="opacity-70"
                  />
                )}

                {/* Transparent Hover Target Bar */}
                <rect
                  x={pt.x - (chartWidth / currentData.length) / 2}
                  y={paddingTop}
                  width={chartWidth / currentData.length}
                  height={chartHeight + 15}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {activePoint && activeData && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900/95 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700/60 z-20 transition-all duration-100"
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${(activePoint.y / svgHeight) * 100 - 4}%`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-bold text-white">
                {valuePrefix}{activeData.value}{unit}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">
              {activeData.label} {activeData.sublabel ? `· ${activeData.sublabel}` : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
