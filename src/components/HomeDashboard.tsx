/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Bell, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  CreditCard as CardIcon, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Asset, Transaction } from '../types';
import { motion } from 'motion/react';

interface HomeDashboardProps {
  assets: Asset[];
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onNavigate: (view: 'home' | 'cards' | 'analytics' | 'swap' | 'checkout') => void;
  currencyMode: 'USD' | 'XAU';
  setCurrencyMode: (mode: 'USD' | 'XAU') => void;
  themeStyle?: any;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  assets,
  transactions,
  onSelectTransaction,
  onNavigate,
  currencyMode,
  setCurrencyMode,
  themeStyle,
}) => {
  const isLight = themeStyle?.isLight || false;
  const textPrimary = isLight ? 'text-slate-900' : 'text-slate-100';
  const textSecondary = isLight ? 'text-slate-700' : 'text-slate-300';
  const textMuted = isLight ? 'text-slate-500' : 'text-slate-400';
  const cardBgClass = isLight ? 'bg-white border-slate-200 hover:bg-slate-50/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)]' : 'glass-panel hover:border-slate-500/20';
  const headerBtnClass = isLight ? 'bg-slate-100/90 border border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/40 border border-slate-700/20 text-slate-300 hover:bg-slate-800/80';
  const sectionTitleClass = isLight ? 'text-slate-800 font-extrabold' : 'text-slate-300';

  // Calculate total balance
  const totalBalanceUSD = assets.reduce((sum, asset) => sum + asset.balanceInUSD, 0);
  const goldPricePerOz = 2425; // mock price of gold
  const totalBalanceInGold = totalBalanceUSD / goldPricePerOz;
  
  // Render miniature sparkline
  const renderSparkline = (points: number[], color: string) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;
    const height = 16;
    const width = 45;
    const step = width / (points.length - 1);
    
    const pathData = points.map((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
      <svg width={width} h={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke={color.includes('emerald') ? '#10B981' : color.includes('orange') ? '#F97316' : color.includes('violet') ? '#8B5CF6' : '#F59E0B'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between py-4" id="home-header">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-[1.5px] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                alt="Profile" 
                className={`w-full h-full rounded-full object-cover border ${isLight ? 'border-white' : 'border-slate-900'}`}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 ${isLight ? 'border-white' : 'border-slate-950'}`}></div>
          </div>
          <div className="text-left">
            <p className={`text-[11px] ${textMuted} font-medium`}>Chào mừng trở lại,</p>
            <h4 className={`text-sm font-semibold ${textPrimary} tracking-tight font-display`}>Anh Đào</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <button className={`w-9 h-9 rounded-full ${headerBtnClass} flex items-center justify-center relative active:scale-95 transition-all`}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>
          
          {/* Scan QR Button */}
          <button className={`w-9 h-9 rounded-full ${headerBtnClass} flex items-center justify-center active:scale-95 transition-all`}>
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className={`relative mt-2 mb-6 p-5 rounded-3xl overflow-hidden border transition-all ${
        isLight 
          ? 'bg-gradient-to-tr from-amber-500/15 via-amber-100/35 to-amber-50/10 border-amber-300/40 shadow-[0_8px_32px_rgba(217,119,6,0.06)]' 
          : 'glass-panel-gold border-amber-500/15 shadow-[0_8px_32px_rgba(245,158,11,0.04)]'
      }`}>
        {/* Subtle decorative glow */}
        <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-amber-500/10 blur-[40px] glow-ambient"></div>
        <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 rounded-full bg-indigo-500/5 blur-[30px] glow-ambient"></div>

        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'} uppercase tracking-widest font-semibold flex items-center gap-1.5`}>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            Tổng Tài Sản Bảo Chứng
          </span>
          {/* Currency Toggle */}
          <div className={`flex ${isLight ? 'bg-slate-200/60 border-slate-300' : 'bg-slate-900/60 border-slate-800'} p-0.5 rounded-lg border`}>
            <button 
              onClick={() => setCurrencyMode('USD')}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${currencyMode === 'USD' ? 'bg-amber-500 text-slate-950 shadow-sm' : `${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400'}`}`}
            >
              USD
            </button>
            <button 
              onClick={() => setCurrencyMode('XAU')}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${currencyMode === 'XAU' ? 'bg-amber-500 text-slate-950 shadow-sm' : `${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400'}`}`}
            >
              GOLD
            </button>
          </div>
        </div>

        <div className="mb-4">
          {currencyMode === 'USD' ? (
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-slate-50'}`}>$</span>
              <span className={`text-3xl font-extrabold font-display ${isLight ? 'text-slate-900' : 'text-slate-50'} tracking-tight`}>
                {totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-display text-amber-500 tracking-tight">
                {totalBalanceInGold.toFixed(3)}
              </span>
              <span className="text-lg font-bold font-display text-amber-500">oz</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +2.14%
            </span>
            <span className={`text-[10px] ${textMuted}`}>24 giờ qua</span>
          </div>
        </div>

        {/* Mini stats grid inside card */}
        <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${isLight ? 'border-amber-300/30' : 'border-slate-800/40'} text-xs text-left`}>
          <div>
            <span className={`text-[10px] ${textMuted} block`}>Ví Kim Loại</span>
            <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>12.45 oz XAU</span>
          </div>
          <div className="text-right">
            <span className={`text-[10px] ${textMuted} block`}>Lợi Nhuận Năm</span>
            <span className="font-semibold text-amber-600">+8.45% APY</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6" id="quick-actions">
        <button 
          onClick={() => onNavigate('swap')}
          className="flex flex-col items-center gap-1.5 group active:scale-95 transition-all"
        >
          <div className={`w-12 h-12 rounded-2xl ${isLight ? 'bg-amber-500/10 border-amber-300' : 'bg-amber-500/10 border-amber-500/20'} border flex items-center justify-center group-hover:bg-amber-500/20 transition-colors`}>
            <ArrowUpRight className="w-5 h-5 text-amber-600" />
          </div>
          <span className={`text-[10px] ${textSecondary} font-medium tracking-tight`}>Gửi Đi</span>
        </button>

        <button 
          onClick={() => onNavigate('swap')}
          className="flex flex-col items-center gap-1.5 group active:scale-95 transition-all"
        >
          <div className={`w-12 h-12 rounded-2xl ${isLight ? 'bg-indigo-500/10 border-indigo-300' : 'bg-indigo-500/10 border-indigo-500/20'} border flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors`}>
            <ArrowDownLeft className="w-5 h-5 text-indigo-500" />
          </div>
          <span className={`text-[10px] ${textSecondary} font-medium tracking-tight`}>Nhận Vào</span>
        </button>

        <button 
          onClick={() => onNavigate('swap')}
          className="flex flex-col items-center gap-1.5 group active:scale-95 transition-all"
        >
          <div className={`w-12 h-12 rounded-2xl ${isLight ? 'bg-slate-100 border-slate-200 hover:bg-slate-200' : 'bg-slate-800/50 border-slate-700/20 hover:bg-slate-800'} border flex items-center justify-center transition-colors`}>
            <RefreshCw className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`} />
          </div>
          <span className={`text-[10px] ${textSecondary} font-medium tracking-tight`}>Chuyển Đổi</span>
        </button>

        <button 
          onClick={() => onNavigate('cards')}
          className="flex flex-col items-center gap-1.5 group active:scale-95 transition-all"
        >
          <div className={`w-12 h-12 rounded-2xl ${isLight ? 'bg-slate-100 border-slate-200 hover:bg-slate-200' : 'bg-slate-800/50 border-slate-700/20 hover:bg-slate-800'} border flex items-center justify-center transition-colors`}>
            <CardIcon className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`} />
          </div>
          <span className={`text-[10px] ${textSecondary} font-medium tracking-tight`}>Thẻ Metal</span>
        </button>
      </div>

      {/* Checkout Gateway Promo Card */}
      <div 
        onClick={() => onNavigate('checkout')}
        className={`mb-6 p-4 rounded-2xl ${
          isLight 
            ? 'bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent border-indigo-200/85 hover:border-indigo-400' 
            : 'bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border-indigo-500/25 hover:border-indigo-500/40'
        } border cursor-pointer active:scale-98 transition-all flex items-center justify-between gap-3 relative overflow-hidden`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isLight ? 'bg-indigo-500/10 text-indigo-600 border-indigo-200' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/10'} border flex items-center justify-center shrink-0`}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Mẫu Demo Thanh Toán</span>
            <span className={`text-[11.5px] font-bold ${textPrimary} block`}>pay.auxvault.com</span>
            <span className={`text-[9.5px] ${textMuted} block mt-0.5`}>Bố cục, nội dung cổng thanh toán Sunrise Coffee</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Asset Holdings Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h5 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleClass}`}>Tài Sản Của Tôi</h5>
          <span className="text-[11px] text-amber-600 font-medium flex items-center gap-0.5 hover:underline cursor-pointer">
            Xem thêm <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          {assets.map((asset) => {
            const isNegative = asset.change24h < 0;
            return (
              <div 
                key={asset.id}
                className={`p-3.5 rounded-2xl ${cardBgClass} border active:scale-98 transition-all flex flex-col justify-between aspect-[1.3] relative overflow-hidden`}
              >
                {/* Visual gradient accent */}
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${asset.color}`}></div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col pl-1.5">
                    <span className={`text-xs font-bold ${textPrimary} font-display`}>{asset.symbol}</span>
                    <span className={`text-[9px] ${textMuted} font-medium line-clamp-1`}>{asset.name}</span>
                  </div>
                  {renderSparkline(asset.sparkline, asset.color)}
                </div>

                <div className="mt-2.5 pl-1.5">
                  <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {asset.balance.toLocaleString('en-US', { maximumFractionDigits: asset.id === 'BTC' ? 4 : 2 })} 
                    <span className={`text-[9.5px] font-medium ${textMuted} ml-0.5`}>
                      {asset.id === 'GOLD' ? 'oz' : asset.id === 'USD' ? '$' : asset.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`text-[9px] ${textMuted}`}>
                      ${asset.balanceInUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                    {asset.change24h !== 0 && (
                      <span className={`text-[8.5px] font-bold flex items-center ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {isNegative ? '-' : '+'}{Math.abs(asset.change24h)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h5 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleClass}`}>Giao Dịch Gần Đây</h5>
          <button 
            onClick={() => onNavigate('analytics')}
            className={`text-[11px] ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'} transition-colors`}
          >
            Lịch sử chi tiêu
          </button>
        </div>

        <div className="space-y-2.5 overflow-y-auto max-h-[190px] pr-1 text-left" id="transaction-list">
          {transactions.map((tx) => {
            const isExpense = tx.amount < 0;
            const isGold = tx.assetType === 'GOLD';
            const isAux = tx.assetType === 'AUX';
            
            let catColor = isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300';
            if (tx.category === 'Shopping') catColor = isLight ? 'bg-violet-100 text-violet-700' : 'bg-violet-500/10 text-violet-400 border border-violet-500/10';
            if (tx.category === 'Food') catColor = isLight ? 'bg-orange-100 text-orange-700' : 'bg-orange-500/10 text-orange-400 border border-orange-500/10';
            if (tx.category === 'Travel') catColor = isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/10 text-sky-400 border border-sky-500/10';
            if (tx.category === 'Investment') catColor = isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/10 text-amber-500 border border-amber-500/15';
            if (tx.category === 'Utilities') catColor = isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10';

            return (
              <div 
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className={`p-3 rounded-xl border ${cardBgClass} cursor-pointer active:scale-99 transition-all flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center font-display text-xs font-bold ${catColor}`}>
                    {tx.category.charAt(0)}
                  </div>
                  <div>
                    <h6 className={`text-xs font-bold ${isLight ? 'text-slate-850' : 'text-slate-200'} line-clamp-1`}>{tx.title}</h6>
                    <p className={`text-[9px] ${textMuted} mt-0.5`}>{tx.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold ${isExpense ? (isLight ? 'text-slate-700' : 'text-slate-300') : 'text-emerald-500 font-semibold'}`}>
                    {isExpense ? '' : '+'}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: isGold ? 2 : 2 })}
                    <span className={`text-[9px] ${textMuted} ml-0.5`}>{isGold ? 'oz' : isAux ? 'AUX' : '$'}</span>
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {tx.status === 'Failed' ? (
                      <span className="text-[8px] font-bold text-rose-500 uppercase tracking-wider">Thất bại</span>
                    ) : tx.status === 'Pending' ? (
                      <span className="text-[8px] font-bold text-amber-600 uppercase tracking-wider">Đang xử lý</span>
                    ) : (
                      <span className={`text-[8.5px] ${textMuted} font-mono`}>
                        ~${Math.abs(tx.amountInUSD).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
