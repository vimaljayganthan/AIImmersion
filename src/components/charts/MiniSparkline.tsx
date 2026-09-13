import React from 'react';

interface MiniSparklineProps {
  data: number[];
  color?: string; // Tailwind hex or class e.g. '#10B981', '#0EA5E9', '#6366F1'
  height?: number;
  width?: number;
  strokeWidth?: number;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color = '#0EA5E9',
  height = 28,
  width = 64,
  strokeWidth = 2,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const effectiveHeight = height - padding * 2;
  const effectiveWidth = width - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * effectiveWidth;
    const y = padding + effectiveHeight - ((val - min) / range) * effectiveHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <svg width={width} height={height} className="overflow-visible inline-block shrink-0">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End point highlight dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].split(',')[0]}
          cy={points[points.length - 1].split(',')[1]}
          r={2.5}
          fill={color}
        />
      )}
    </svg>
  );
};
