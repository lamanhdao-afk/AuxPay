/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingUp, Award, Calendar, DollarSign, Wallet, ShieldAlert } from 'lucide-react';
import { Transaction } from '../types';

interface AnalyticsPanelProps {
  transactions: Transaction[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ transactions }) => {
  const [timeframe, setTimeframe] = React.useState<'1W' | '1M' | '3M' | '1Y'>('1M');
  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null);

  // Mock data for the line chart based on timeframe
  const chartData = {
    '1W': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [42100, 42350, 42200, 42800, 43100, 42900, 43411],
    },
    '1M': {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
      values: [38500, 40200, 41100, 43411],
    },
    '3M': {
      labels: ['May', 'Jun', 'Jul'],
      values: [35000, 39800, 43411],
    },
    '1Y': {
      labels: ['Jul 25', 'Sep 25', 'Nov 25', 'Jan 26', 'Mar 26', 'May 26', 'Jul 26'],
      values: [28000, 31000, 33500, 36200, 39000, 41500, 43411],
    }
  };

  const activeData = chartData[timeframe];

  // Draw the SVG Area chart dynamically
  const width = 310;
  const height = 120;
  const padding = 12;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minVal = Math.min(...activeData.values) * 0.98;
  const maxVal = Math.max(...activeData.values) * 1.02;
  const valRange = maxVal - minVal;

  const points = activeData.values.map((val, i) => {
    const x = padding + (i / (activeData.values.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((val - minVal) / valRange) * chartHeight;
    return { x, y, val };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  // Categories spending
  const categories = [
    { name: 'Shopping', spent: 1299.00, budget: 2000, color: 'bg-violet-500' },
    { name: 'Nhà cửa & Tiện ích', spent: 1800.00, budget: 2000, color: 'bg-emerald-500' },
    { name: 'Ăn uống', spent: 14.50, budget: 300, color: 'bg-orange-500' },
    { name: 'Di chuyển', spent: 65.00, budget: 400, color: 'bg-sky-500' },
  ];

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 font-sans">
      {/* View Header */}
      <div className="py-4 flex items-center justify-between" id="analytics-header">
        <div>
          <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest block font-sans">Thống kê tài chính</span>
          <h2 className="text-lg font-bold text-slate-100 font-display">Phân Tích Chi Tiêu</h2>
        </div>
        <button className="px-3 py-1 glass-button rounded-xl flex items-center gap-1.5 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] font-bold">Tháng 7, 2026</span>
        </button>
      </div>

      {/* Main Graph Card */}
      <div className="p-4 rounded-2xl glass-panel mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[9.5px] text-slate-400 font-medium block">Tổng giá trị tài sản ròng</span>
            <span className="text-sm font-bold text-slate-100 font-mono">
              ${hoveredPoint !== null ? points[hoveredPoint].val.toLocaleString('en-US') : activeData.values[activeData.values.length - 1].toLocaleString('en-US')}
            </span>
          </div>

          {/* Graph timeframe selector */}
          <div className="flex bg-slate-950/60 p-0.5 rounded-lg border border-slate-850">
            {(['1W', '1M', '3M', '1Y'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTimeframe(t);
                  setHoveredPoint(null);
                }}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${timeframe === t ? 'bg-indigo-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Pure SVG Line Chart */}
        <div className="h-[120px] relative w-full flex items-center justify-center select-none">
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <defs>
              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((p, idx) => {
              const y = padding + p * chartHeight;
              return (
                <line
                  key={idx}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                />
              );
            })}

            {/* Area under line */}
            <path d={areaPath} fill="url(#areaGlow)" />

            {/* Main graph line */}
            <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Interactive Data Points */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === idx ? '5' : '3'}
                  className="cursor-pointer transition-all duration-200"
                  fill={hoveredPoint === idx ? '#F59E0B' : '#6366F1'}
                  stroke="#0F172A"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Labels underneath the chart */}
        <div className="flex justify-between px-2 text-[9px] text-slate-500 font-semibold font-sans tracking-tight mt-1.5">
          {activeData.labels.map((lbl, i) => (
            <span key={i}>{lbl}</span>
          ))}
        </div>
      </div>

      {/* Spend and Income overview pill indicators */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-2xl glass-panel flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-medium">Chi tiêu hạn mức</span>
            <span className="text-xs font-bold text-slate-200">${totalSpent.toLocaleString('en-US')}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl glass-panel flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-medium">Lợi tức tài sản</span>
            <span className="text-xs font-bold text-slate-200">+$2,425.00</span>
          </div>
        </div>
      </div>

      {/* Spending Categories Bento Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Danh Mục Chi Tiêu</h5>
          <span className="text-[10px] text-indigo-400 font-bold">Tháng 7</span>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[190px] pr-1">
          {categories.map((cat, idx) => {
            const percent = (cat.spent / cat.budget) * 100;
            return (
              <div 
                key={idx}
                className="p-3.5 rounded-xl glass-panel hover:border-slate-500/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></div>
                    <span className="text-xs font-bold text-slate-200">{cat.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    ${cat.spent.toLocaleString('en-US')} <span className="text-[9px] text-slate-500 font-medium">/ ${cat.budget}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/50">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-1 text-[8px] text-slate-400 font-bold">
                  <span>{percent.toFixed(0)}% đã dùng</span>
                  <span>Còn lại: ${(cat.budget - cat.spent).toLocaleString('en-US')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
