import React, { useState } from 'react';
import { DailyTrendPoint } from '../../types';
import { formatMoney } from '../../utils';

const PALETTE = [
  '#0D9488', // Teal 600
  '#0284C7', // Sky 600
  '#F59E0B', // Amber 500
  '#6366F1', // Indigo 500
  '#E11D48', // Rose 600
  '#10B981', // Emerald 500
  '#8B5CF6', // Violet 500
  '#64748B', // Slate 500
];

interface TrendChartProps {
  data: DailyTrendPoint[];
  currency: string;
  labels: {
    revenue: string;
    expenses: string;
    netMargin: string;
    noData: string;
  };
}

export const TrendBarLineChart: React.FC<TrendChartProps> = ({ data, currency, labels }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-slate-400">
        {labels.noData}
      </div>
    );
  }

  const width = 760;
  const height = 240;
  const pad = { top: 20, right: 20, bottom: 34, left: 68 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const maxVal = Math.max(
    10,
    ...data.flatMap((d) => [d.revenue, d.expenses, Math.max(0, d.net_margin)])
  );
  const niceMax = Math.ceil(maxVal * 1.15);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    val: niceMax * t,
    y: pad.top + plotH - plotH * t,
  }));

  const groupWidth = plotW / data.length;
  const barWidth = Math.min(26, Math.max(8, groupWidth * 0.28));

  const formatShortDate = (label: string) => {
    if (label.includes(':')) return label; // Hourly e.g. 09:00
    if (label.includes('-W')) return label.split('-')[1]; // Weekly e.g. W47
    const parts = label.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}` : label;
  };

  const marginPoints = data
    .map((d, idx) => {
      const cx = pad.left + groupWidth * idx + groupWidth / 2;
      const clamped = Math.max(0, d.net_margin);
      const cy = pad.top + plotH - (clamped / niceMax) * plotH;
      return `${cx},${cy}`;
    })
    .join(' ');

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="space-y-3">
      {/* Legend & Hover Readout */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0D9488]" />
            {labels.revenue}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E11D48]" />
            {labels.expenses}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-3 h-0.5 bg-[#0284C7] rounded-full" />
            {labels.netMargin}
          </span>
        </div>

        {hovered && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono">
            <span className="font-semibold text-slate-700">{hovered.date}</span>
            <span className="text-[#0D9488] font-bold">+{formatMoney(hovered.revenue, currency)}</span>
            <span className="text-rose-600 font-bold">-{formatMoney(hovered.expenses, currency)}</span>
            <span className={hovered.net_margin >= 0 ? 'text-sky-700 font-bold' : 'text-rose-700 font-bold'}>
              {formatMoney(hovered.net_margin, currency)}
            </span>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[460px] h-56 select-none"
          role="img"
          aria-label={labels.revenue}
        >
          {/* Horizontal gridlines & Y labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={tick.y}
                y2={tick.y}
                stroke="#E2E8F0"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={pad.left - 8}
                y={tick.y + 3.5}
                textAnchor="end"
                className="fill-slate-400 text-[10px] font-mono"
              >
                {currency === 'CDF'
                  ? `${Math.round((tick.val * 2850) / 1000)}k`
                  : `$${Math.round(tick.val)}`}
              </text>
            </g>
          ))}

          {/* Grouped Bars */}
          {data.map((d, idx) => {
            const cx = pad.left + groupWidth * idx + groupWidth / 2;
            const revH = (d.revenue / niceMax) * plotH;
            const expH = (d.expenses / niceMax) * plotH;
            const isHovered = hoverIdx === idx;

            return (
              <g
                key={d.date}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                {/* Hover column highlight */}
                <rect
                  x={pad.left + groupWidth * idx + 2}
                  y={pad.top}
                  width={Math.max(4, groupWidth - 4)}
                  height={plotH}
                  rx={4}
                  fill={isHovered ? '#F1F5F9' : 'transparent'}
                />

                {/* Revenue Bar */}
                <rect
                  x={cx - barWidth - 1.5}
                  y={pad.top + plotH - revH}
                  width={barWidth}
                  height={Math.max(0, revH)}
                  rx={3}
                  fill="#0D9488"
                  opacity={hoverIdx === null || isHovered ? 0.92 : 0.45}
                />

                {/* Expenses Bar */}
                <rect
                  x={cx + 1.5}
                  y={pad.top + plotH - expH}
                  width={barWidth}
                  height={Math.max(0, expH)}
                  rx={3}
                  fill="#E11D48"
                  opacity={hoverIdx === null || isHovered ? 0.88 : 0.45}
                />

                {/* X-Axis Date Label */}
                {(data.length <= 12 || idx % Math.ceil(data.length / 10) === 0) && (
                  <text
                    x={cx}
                    y={height - 10}
                    textAnchor="middle"
                    className={`text-[10px] font-mono ${isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-500'}`}
                  >
                    {formatShortDate(d.date)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Net Margin Line Overlay */}
          {data.length > 1 && (
            <polyline
              fill="none"
              stroke="#0284C7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={marginPoints}
              pointerEvents="none"
            />
          )}

          {/* Line Nodes */}
          {data.map((d, idx) => {
            const cx = pad.left + groupWidth * idx + groupWidth / 2;
            const clamped = Math.max(0, d.net_margin);
            const cy = pad.top + plotH - (clamped / niceMax) * plotH;
            const isHovered = hoverIdx === idx;
            return (
              <circle
                key={`pt-${d.date}`}
                cx={cx}
                cy={cy}
                r={isHovered ? 4.5 : 3}
                fill="#FFFFFF"
                stroke="#0284C7"
                strokeWidth="2"
                pointerEvents="none"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export interface BreakdownItem {
  label: string;
  value: number;
}

interface DonutChartProps {
  items: BreakdownItem[];
  currency: string;
  totalLabel: string;
  noDataLabel: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  items,
  currency,
  totalLabel,
  noDataLabel,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const validItems = items.filter((i) => i.value > 0);
  const total = validItems.reduce((acc, i) => acc + i.value, 0);

  if (validItems.length === 0 || total <= 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-slate-400">
        {noDataLabel}
      </div>
    );
  }

  const size = 156;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {validItems.map((item, idx) => {
            const fraction = item.value / total;
            const dashLength = fraction * circumference;
            const dashOffset = -cumulativeOffset;
            cumulativeOffset += dashLength;
            const color = PALETTE[idx % PALETTE.length];
            const isActive = activeIdx === idx;

            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${Math.max(0, dashLength - 1.5)} ${circumference}`}
                strokeDashoffset={dashOffset}
                opacity={activeIdx === null || isActive ? 1 : 0.45}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 pointer-events-none">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            {activeIdx !== null ? validItems[activeIdx].label : totalLabel}
          </span>
          <span className="text-xs font-bold font-mono text-slate-900 mt-0.5 truncate max-w-[100px]">
            {formatMoney(activeIdx !== null ? validItems[activeIdx].value : total, currency)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-2">
        {validItems.map((item, idx) => {
          const pct = Math.round((item.value / total) * 100);
          const color = PALETTE[idx % PALETTE.length];
          const isActive = activeIdx === idx;
          return (
            <div
              key={item.label}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className={`flex items-center justify-between text-xs px-2 py-1 rounded-md transition-colors cursor-pointer ${
                isActive ? 'bg-slate-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium text-slate-700 truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <span className="text-slate-400 text-[11px]">{pct}%</span>
                <span className="font-semibold text-slate-900">{formatMoney(item.value, currency)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface HorizontalBarListProps {
  items: BreakdownItem[];
  currency: string;
  noDataLabel: string;
  barColor?: string;
}

export const HorizontalBarList: React.FC<HorizontalBarListProps> = ({
  items,
  currency,
  noDataLabel,
  barColor = '#E11D48',
}) => {
  const validItems = items.filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
  const total = validItems.reduce((acc, i) => acc + i.value, 0);
  const maxVal = validItems.length > 0 ? validItems[0].value : 0;

  if (validItems.length === 0 || maxVal <= 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-slate-400">
        {noDataLabel}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {validItems.map((item, idx) => {
        const widthPct = Math.max(4, Math.round((item.value / maxVal) * 100));
        const sharePct = Math.round((item.value / total) * 100);
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 truncate pr-2">{item.label}</span>
              <span className="font-mono text-slate-900 font-semibold shrink-0">
                {formatMoney(item.value, currency)}{' '}
                <span className="text-[11px] text-slate-400 font-normal">({sharePct}%)</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: barColor === 'palette' ? PALETTE[idx % PALETTE.length] : barColor,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
