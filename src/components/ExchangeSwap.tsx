/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Asset, AssetType } from '../types';
import { 
  ArrowUpDown, 
  HelpCircle, 
  TrendingUp, 
  ChevronDown, 
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

interface ExchangeSwapProps {
  assets: Asset[];
  onExecuteSwap: (fromAsset: AssetType, toAsset: AssetType, fromAmount: number, toAmount: number) => void;
}

export const ExchangeSwap: React.FC<ExchangeSwapProps> = ({ assets, onExecuteSwap }) => {
  const [fromAsset, setFromAsset] = React.useState<AssetType>('USD');
  const [toAsset, setToAsset] = React.useState<AssetType>('GOLD');
  const [fromAmount, setFromAmount] = React.useState('0');
  const [dropdownOpen, setDropdownOpen] = React.useState<'from' | 'to' | null>(null);
  const [swapSuccess, setSwapSuccess] = React.useState(false);
  const [slideProgress, setSlideProgress] = React.useState(0);
  const [isSliding, setIsSliding] = React.useState(false);

  const activeFromAsset = assets.find(a => a.id === fromAsset)!;
  const activeToAsset = assets.find(a => a.id === toAsset)!;

  // Mock rates relative to USD
  const rates: Record<AssetType, number> = {
    USD: 1.0,
    GOLD: 2425.0, // USD per oz
    AUX: 1.15,    // USD per AUX
    BTC: 64250.0  // USD per BTC
  };

  // Convert "From" amount to "To" amount
  const getExchangeRate = () => {
    const fromRateInUSD = rates[fromAsset];
    const toRateInUSD = rates[toAsset];
    return fromRateInUSD / toRateInUSD;
  };

  const exchangeRate = getExchangeRate();
  const calculatedToAmount = (parseFloat(fromAmount) || 0) * exchangeRate;

  // Keypad clicks
  const handleKeyPress = (key: string) => {
    if (swapSuccess) return;
    
    if (key === 'C') {
      setFromAmount('0');
      return;
    }
    
    if (key === '.') {
      if (fromAmount.includes('.')) return;
      setFromAmount(prev => prev + '.');
      return;
    }
    
    setFromAmount(prev => {
      if (prev === '0') return key;
      // limit decimals based on type
      if (prev.includes('.') && prev.split('.')[1].length >= 4) return prev;
      return prev + key;
    });
  };

  const handleBackspace = () => {
    if (swapSuccess) return;
    setFromAmount(prev => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const swapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setFromAmount('0');
  };

  // Drag slide action confirm simulation
  const handleSlideStart = () => {
    if (parseFloat(fromAmount) <= 0 || parseFloat(fromAmount) > activeFromAsset.balance) return;
    setIsSliding(true);
  };

  const handleSlideMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isSliding) return;
    const container = document.getElementById('slider-track');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let progress = ((clientX - rect.left) / rect.width) * 100;
    
    progress = Math.max(0, Math.min(progress, 100));
    setSlideProgress(progress);

    if (progress >= 95) {
      setIsSliding(false);
      setSlideProgress(100);
      confirmSwap();
    }
  };

  const handleSlideEnd = () => {
    setIsSliding(false);
    if (slideProgress < 95) {
      setSlideProgress(0);
    }
  };

  const confirmSwap = () => {
    onExecuteSwap(fromAsset, toAsset, parseFloat(fromAmount), calculatedToAmount);
    setSwapSuccess(true);
    setTimeout(() => {
      setSwapSuccess(false);
      setFromAmount('0');
      setSlideProgress(0);
    }, 3000);
  };

  const hasInsufficientBalance = parseFloat(fromAmount) > activeFromAsset.balance;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 font-sans relative">
      {/* View Title */}
      <div className="py-4 flex items-center justify-between" id="swap-header">
        <div>
          <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest block">Chuyển đổi kim loại & coin</span>
          <h2 className="text-lg font-bold text-slate-100 font-display">Giao Dịch Đổi Tài Sản</h2>
        </div>
        <button className="w-8.5 h-8.5 rounded-full bg-slate-800/40 border border-slate-700/20 flex items-center justify-center text-amber-500">
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {swapSuccess ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" id="swap-success-panel">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/30 mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-display">Giao dịch thành công!</h3>
          <p className="text-xs text-slate-400 mt-1">
            Đã chuyển đổi <span className="font-bold text-slate-200">{parseFloat(fromAmount).toLocaleString()} {fromAsset}</span> sang <span className="font-bold text-amber-400">{calculatedToAmount.toLocaleString('en-US', { maximumFractionDigits: 4 })} {toAsset}</span>.
          </p>
          <div className="p-4 rounded-xl glass-panel w-full mt-6 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Mã giao dịch:</span>
              <span className="font-mono text-slate-300">TX-SWAP-92810</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tỷ giá quy đổi:</span>
              <span className="text-slate-300">1 {fromAsset} = {exchangeRate.toFixed(6)} {toAsset}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Swap Input Blocks */}
          <div className="space-y-2.5 relative">
            {/* From Asset Block */}
            <div className="p-4 rounded-2xl glass-panel relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Từ tài sản</span>
                <span 
                  onClick={() => setFromAmount(activeFromAsset.balance.toString())}
                  className="text-[10.5px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors"
                >
                  Dùng Max: {activeFromAsset.balance.toLocaleString()} {activeFromAsset.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <button 
                  onClick={() => setDropdownOpen(dropdownOpen === 'from' ? null : 'from')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-100"
                >
                  <span className="font-display">{fromAsset}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <div className="text-right flex-1 min-w-0 ml-4">
                  <input 
                    type="text" 
                    readOnly
                    value={fromAmount}
                    className="w-full bg-transparent text-right font-display text-xl font-bold text-slate-100 focus:outline-none placeholder-slate-600"
                    placeholder="0.00"
                  />
                  <p className="text-[9.5px] text-slate-500 mt-0.5 font-sans">
                    ~${(parseFloat(fromAmount) * rates[fromAsset] || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Dropdown Options */}
              {dropdownOpen === 'from' && (
                <div className="absolute left-4 top-[74px] w-36 rounded-xl glass-panel p-1.5 z-40 shadow-xl">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setFromAsset(asset.id);
                        setDropdownOpen(null);
                        setFromAmount('0');
                      }}
                      className="w-full text-left p-2 hover:bg-slate-800/40 rounded-lg text-xs font-bold text-slate-200 transition-colors flex justify-between items-center"
                    >
                      <span>{asset.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{asset.balance.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Middle Switch Button */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[82px] z-20">
              <button 
                onClick={swapAssets}
                className="w-8.5 h-8.5 rounded-full bg-amber-500 text-slate-950 shadow-lg border-2 border-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* To Asset Block */}
            <div className={`p-4 rounded-2xl relative ${toAsset === 'GOLD' ? 'glass-panel-gold' : 'glass-panel'}`}>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Đổi sang tài sản</span>

              <div className="flex items-center justify-between mt-2">
                <button 
                  onClick={() => setDropdownOpen(dropdownOpen === 'to' ? null : 'to')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-100"
                >
                  <span className="font-display">{toAsset}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <div className="text-right flex-1 min-w-0 ml-4">
                  <div className={`text-xl font-bold font-display ${toAsset === 'GOLD' ? 'text-amber-400' : 'text-slate-100'}`}>
                    {calculatedToAmount.toLocaleString('en-US', { maximumFractionDigits: 5 })}
                  </div>
                  <p className="text-[9.5px] text-slate-500 mt-0.5 font-sans">
                    ~${(calculatedToAmount * rates[toAsset] || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Dropdown Options */}
              {dropdownOpen === 'to' && (
                <div className="absolute left-4 top-[74px] w-36 rounded-xl glass-panel p-1.5 z-40 shadow-xl">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setToAsset(asset.id);
                        setDropdownOpen(null);
                      }}
                      className="w-full text-left p-2 hover:bg-slate-800/40 rounded-lg text-xs font-bold text-slate-200 transition-colors flex justify-between items-center"
                    >
                      <span>{asset.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{asset.balance.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Live Exchange Rate Banner */}
          <div className="my-3 px-4 py-2 glass-panel rounded-xl flex items-center justify-between text-[10.5px]">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <RefreshCw className="w-3.5 h-3.5 text-amber-500/80 animate-spin-slow" />
              Tỷ giá cập nhật liên tục:
            </span>
            <span className="font-bold text-slate-300 font-mono">
              1 {fromAsset} = {exchangeRate.toFixed(4)} {toAsset}
            </span>
          </div>

          {/* Integrated Soft Numeric Touch Keypad */}
          <div className="grid grid-cols-3 gap-1.5 mt-2 mb-4 glass-panel p-2 rounded-2xl">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num)}
                className="py-3 text-sm font-bold text-slate-200 rounded-xl glass-button font-display"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleBackspace}
              className="py-3 text-sm font-bold text-slate-400 rounded-xl glass-button flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          {/* Slide to Confirm Action Slider */}
          <div className="relative mt-auto">
            <div 
              id="slider-track"
              className={`w-full h-12 rounded-2xl relative flex items-center justify-center overflow-hidden border ${
                hasInsufficientBalance 
                  ? 'bg-rose-950/20 border-rose-900/40 text-rose-400' 
                  : parseFloat(fromAmount) <= 0 
                  ? 'bg-slate-900/50 border-slate-800/80 text-slate-500' 
                  : 'bg-amber-950/20 border-amber-900/40 text-amber-400'
              }`}
              onMouseMove={handleSlideMove}
              onTouchMove={handleSlideMove}
              onMouseUp={handleSlideEnd}
              onTouchEnd={handleSlideEnd}
              onMouseLeave={handleSlideEnd}
            >
              {/* Sliding Track progress back glow */}
              <div 
                className="absolute left-0 top-0 h-full bg-amber-500/10 pointer-events-none"
                style={{ width: `${slideProgress}%` }}
              ></div>

              <span className="text-[11px] font-bold tracking-wider select-none relative z-10 font-sans pointer-events-none uppercase">
                {hasInsufficientBalance 
                  ? 'Số dư không đủ' 
                  : parseFloat(fromAmount) <= 0 
                  ? 'Nhập số tiền chuyển đổi' 
                  : 'Vuốt để xác nhận đổi'}
              </span>

              {/* Slider Grab Handle */}
              {!hasInsufficientBalance && parseFloat(fromAmount) > 0 && (
                <div 
                  className="absolute left-1 top-1 bottom-1 w-11 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing select-none z-20"
                  style={{ transform: `translateX(${(slideProgress / 100) * 230}px)` }}
                  onMouseDown={handleSlideStart}
                  onTouchStart={handleSlideStart}
                >
                  ➔
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
