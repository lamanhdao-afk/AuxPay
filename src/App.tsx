/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  CreditCard as CardIcon, 
  TrendingUp, 
  RefreshCw, 
  Settings, 
  Sparkles, 
  Palette, 
  Play, 
  RotateCcw,
  Zap,
  Info,
  DollarSign,
  Sun,
  Moon
} from 'lucide-react';

import { Asset, AssetType, CreditCard, Transaction } from './types';
import { INITIAL_ASSETS, INITIAL_CARDS, INITIAL_TRANSACTIONS } from './mockData';
import { MobileDevice } from './components/MobileDevice';
import { HomeDashboard } from './components/HomeDashboard';
import { CardManager } from './components/CardManager';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ExchangeSwap } from './components/ExchangeSwap';
import { ReceiptDetail } from './components/ReceiptDetail';
import { CheckoutGateway } from './components/CheckoutGateway';

// Theme presets for beautiful Dark Mode combinations (avoiding dull pitch black)
export interface ThemePreset {
  id: string;
  name: string;
  baseBg: string;
  cardBg: string;
  accentColor: string;
  glowColor: string;
  desc: string;
  isLight?: boolean;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    baseBg: 'bg-gradient-to-b from-[#0F141E] via-[#151D2A] to-[#0E131B]',
    cardBg: 'bg-[#1E293B]/45',
    accentColor: 'text-[#06b6d4]',
    glowColor: 'rgba(6, 182, 212, 0.15)',
    desc: 'Giao diện tối kết hợp xanh dương và cyan để nổi bật các form nhập liệu.',
  },
  {
    id: 'light-mode',
    name: 'Light Mode',
    baseBg: 'bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]',
    cardBg: 'bg-white',
    accentColor: 'text-[#1668a8]',
    glowColor: 'rgba(22, 104, 168, 0.08)',
    desc: 'Giao diện sáng thanh khiết với mảng màu cam nhạt hòa quyện.',
    isLight: true,
  },
];

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 6, g: 182, b: 212 };
}

export default function App() {
  const [activeView, setActiveView] = React.useState<'home' | 'cards' | 'analytics' | 'swap' | 'checkout'>('checkout');
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null);
  const [activeTheme, setActiveTheme] = React.useState<ThemePreset>(THEME_PRESETS[0]);
  const [customColor, setCustomColor] = React.useState<string>('#67e8f9');
  const [currencyMode, setCurrencyMode] = React.useState<'USD' | 'XAU'>('USD');

  // Synchronize customColor when theme changes
  React.useEffect(() => {
    const isLight = activeTheme.isLight;
    setCustomColor(isLight ? '#60a5fa' : '#67e8f9');
  }, [activeTheme.id]);

  const dynamicTheme = React.useMemo(() => {
    const rgb = hexToRgb(customColor);
    return {
      ...activeTheme,
      accentColor: `text-[${customColor}]`,
      glowColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${activeTheme.isLight ? '0.08' : '0.15'})`
    };
  }, [activeTheme, customColor]);

  // App data state
  const [assets, setAssets] = React.useState<Asset[]>(INITIAL_ASSETS);
  const [cards, setCards] = React.useState<CreditCard[]>(INITIAL_CARDS);
  const [transactions, setTransactions] = React.useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Live gold fluctuation Simulation
  const [goldPrice, setGoldPrice] = React.useState(2425);
  const [tickerMessage, setTickerMessage] = React.useState<string | null>(null);

  // Simulation: Trigger random expense from a famous store
  const simulateLiveTransaction = () => {
    const merchants = [
      { name: 'Tesla Supercharger', desc: 'Sạc xe điện tự động', amount: -45.00, cat: 'Travel' as const },
      { name: 'Rolex Boutique', desc: 'Thanh toán phụ kiện', amount: -9500.00, cat: 'Shopping' as const },
      { name: 'McDonalds Fastfood', desc: 'Ăn tối muộn', amount: -18.50, cat: 'Food' as const },
      { name: 'AWS Cloud Hosting', desc: 'Dịch vụ lưu trữ máy chủ', amount: -280.00, cat: 'Utilities' as const },
    ];
    
    const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
    const id = `tx-sim-${Date.now()}`;
    const now = new Date();
    const timeString = `Hôm nay, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newTx: Transaction = {
      id,
      title: randomMerchant.name,
      description: randomMerchant.desc,
      merchant: randomMerchant.name,
      category: randomMerchant.cat,
      amount: randomMerchant.amount,
      assetType: 'USD',
      amountInUSD: randomMerchant.amount,
      date: timeString,
      status: 'Completed',
      referenceId: `SIM-LIV-${Math.floor(Math.random() * 89999) + 10000}`,
      fundingSource: 'Gold Metal Card (•••• 8824)',
    };

    // Prepend transaction
    setTransactions(prev => [newTx, ...prev]);
    
    // Deduct active card balance
    setCards(prev => prev.map(c => {
      if (c.id === 'card-1') {
        return { ...c, balance: Math.max(0, c.balance + randomMerchant.amount) };
      }
      return c;
    }));

    // Alert banner
    setTickerMessage(`Giao dịch giả lập: Đã chi tiêu $${Math.abs(randomMerchant.amount).toLocaleString()} tại ${randomMerchant.name}`);
    setTimeout(() => setTickerMessage(null), 5000);
  };

  // Simulate Gold price change
  const simulateGoldPriceChange = () => {
    const changePct = (Math.random() * 2 - 0.9) / 100; // -0.9% to +1.1%
    const currentPrice = goldPrice;
    const nextPrice = currentPrice * (1 + changePct);
    setGoldPrice(nextPrice);

    // Update assets balance
    setAssets(prev => prev.map(a => {
      if (a.id === 'GOLD') {
        const nextBalanceInUSD = a.balance * nextPrice;
        return {
          ...a,
          balanceInUSD: nextBalanceInUSD,
          change24h: parseFloat((a.change24h + changePct * 100).toFixed(2)),
          sparkline: [...a.sparkline.slice(1), nextPrice],
        };
      }
      return a;
    }));

    setTickerMessage(`Giá vàng thế giới biến động: ${changePct >= 0 ? '▲' : '▼'} ${Math.abs(changePct * 100).toFixed(2)}% (Mới: $${nextPrice.toFixed(2)}/oz)`);
    setTimeout(() => setTickerMessage(null), 4000);
  };

  // Reset demo states
  const handleReset = () => {
    setAssets(INITIAL_ASSETS);
    setCards(INITIAL_CARDS);
    setTransactions(INITIAL_TRANSACTIONS);
    setGoldPrice(2425);
    setActiveView('home');
    setSelectedTx(null);
    setTickerMessage('Đã khôi phục dữ liệu ban đầu!');
    setTimeout(() => setTickerMessage(null), 3000);
  };

  // Handle card freeze toggle
  const handleToggleFreeze = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, isFrozen: !c.isFrozen };
      }
      return c;
    }));
  };

  // Handle spending limit updates
  const handleUpdateLimit = (cardId: string, value: number) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, limit: value };
      }
      return c;
    }));
  };

  // Swap transaction execution
  const handleExecuteSwap = (fromType: AssetType, toType: AssetType, fromAmt: number, toAmt: number) => {
    // 1. Update balances
    setAssets(prev => prev.map(asset => {
      if (asset.id === fromType) {
        const nextBalance = asset.balance - fromAmt;
        const rate = fromType === 'GOLD' ? goldPrice : fromType === 'AUX' ? 1.15 : fromType === 'BTC' ? 64250 : 1;
        return {
          ...asset,
          balance: nextBalance,
          balanceInUSD: nextBalance * rate,
        };
      }
      if (asset.id === toType) {
        const nextBalance = asset.balance + toAmt;
        const rate = toType === 'GOLD' ? goldPrice : toType === 'AUX' ? 1.15 : toType === 'BTC' ? 64250 : 1;
        return {
          ...asset,
          balance: nextBalance,
          balanceInUSD: nextBalance * rate,
        };
      }
      return asset;
    }));

    // 2. Add swap transaction item
    const id = `tx-swap-${Date.now()}`;
    const now = new Date();
    const timeString = `Hôm nay, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newTx: Transaction = {
      id,
      title: `Đổi ${fromType} sang ${toType}`,
      description: `Hoán đổi tài sản nội bộ`,
      merchant: `Cổng hoán đổi AuXPay`,
      category: 'Investment',
      amount: -fromAmt,
      assetType: fromType,
      amountInUSD: fromType === 'GOLD' ? -fromAmt * goldPrice : fromType === 'AUX' ? -fromAmt * 1.15 : fromType === 'BTC' ? -fromAmt * 64250 : -fromAmt,
      date: timeString,
      status: 'Completed',
      referenceId: `XAU-SWP-${Math.floor(Math.random() * 89999) + 10000}`,
      fundingSource: 'Ví Giao Dịch AuXPay',
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col md:flex-row antialiased overflow-x-hidden">
      
      {/* LEFT SIDEBAR: Aesthetic controls, design information, and interactive simulations */}
      <div className="w-full md:w-[360px] bg-slate-900/60 md:border-r border-slate-800/80 p-6 flex flex-col gap-6 relative shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1668a8] to-[#06b6d4] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <span className="font-display font-extrabold text-white text-base tracking-tighter">Au</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight font-display text-slate-100 flex items-center gap-1.5">
              AuXPay Design Workspace
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#06b6d4]">Premium Fintech Design</p>
          </div>
        </div>

        {/* Dynamic simulation banner popup inside sidebar */}
        {tickerMessage && (
          <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/20 shadow-lg text-[11px] text-slate-300 flex items-start gap-2.5 animate-pulse relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{tickerMessage}</span>
          </div>
        )}

        {/* Section 1: Harmonious Dark Mode Selection */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4.5 h-4.5 text-[#06b6d4]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Trạng thái Giao diện</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Chuyển đổi nhanh trạng thái Sáng (Light Mode) / Tối (Dark Mode) để kiểm chứng độ nổi bật và khả năng tương phản cao của form thanh toán.
          </p>

          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {THEME_PRESETS.map((theme) => {
              const isSelected = theme.id === activeTheme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-extrabold tracking-wide transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[#1668a8] to-[#06b6d4] text-white shadow-md shadow-cyan-950/40 scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {theme.isLight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {theme.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1.5: Custom Theme Accent Color Picker */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: customColor }}></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Màu chủ đạo (Accent)</h3>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {customColor.toUpperCase()}
            </span>
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Thay đổi màu chủ đạo (JS dynamic update) để xem giao diện tự động đồng bộ từ các nút bấm, tab cho đến dải gradient nền sáng.
          </p>

          <div className="flex items-center gap-3">
            {/* Native HTML5 Color Picker Styled beautifully */}
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-700 shrink-0 shadow-lg cursor-pointer hover:border-cyan-500 transition-colors">
              <input 
                type="color" 
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="absolute inset-0 w-[120%] h-[120%] -translate-x-[10%] -translate-y-[10%] cursor-pointer border-none p-0 bg-transparent"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {(activeTheme.isLight 
                ? ['#60a5fa', '#2dd4bf', '#34d399', '#f97316', '#f472b6', '#a78bfa'] 
                : ['#67e8f9', '#6ee7b7', '#fdba74', '#f9a8d4', '#c084fc', '#7dd3fc']
              ).map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => setCustomColor(presetColor)}
                  className="w-6 h-6 rounded-full border border-slate-800 hover:scale-110 active:scale-95 transition-all shadow-md shrink-0"
                  style={{ 
                    backgroundColor: presetColor,
                    borderColor: customColor.toLowerCase() === presetColor.toLowerCase() ? '#ffffff' : 'transparent',
                    boxShadow: customColor.toLowerCase() === presetColor.toLowerCase() ? `0 0 8px ${presetColor}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER WORKSPACE: Smartphone display with fully interactive applet inside */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative bg-[#0B0F19]">
        
        {/* Subtle decorative background light halos (avoiding flat black look!) */}
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[90px] pointer-events-none"></div>

        {/* Smartphone Shell Frame */}
        <MobileDevice themeStyle={activeTheme}>
          
          {/* Main Router Content area depending on active view */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeView === 'home' && (
              <HomeDashboard 
                assets={assets}
                transactions={transactions}
                onSelectTransaction={setSelectedTx}
                onNavigate={setActiveView}
                currencyMode={currencyMode}
                setCurrencyMode={setCurrencyMode}
                themeStyle={activeTheme}
              />
            )}

            {activeView === 'cards' && (
              <CardManager 
                cards={cards}
                transactions={transactions}
                onToggleFreeze={handleToggleFreeze}
                onUpdateLimit={handleUpdateLimit}
                onSelectTransaction={setSelectedTx}
              />
            )}

            {activeView === 'analytics' && (
              <AnalyticsPanel 
                transactions={transactions}
              />
            )}

            {activeView === 'swap' && (
              <ExchangeSwap 
                assets={assets}
                onExecuteSwap={handleExecuteSwap}
              />
            )}

            {activeView === 'checkout' && (
              <CheckoutGateway 
                onAddTransaction={(tx) => setTransactions(prev => [tx, ...prev])}
                onDeductBalance={(amount) => {
                  setCards(prev => prev.map(c => {
                    if (c.id === 'card-1') {
                      return { ...c, balance: Math.max(0, c.balance - amount) };
                    }
                    return c;
                  }));
                }}
                onNavigate={setActiveView}
                themeStyle={dynamicTheme}
              />
            )}
          </div>

          {/* Floating Receipt modal over the phone screen */}
          {selectedTx && (
            <ReceiptDetail 
              transaction={selectedTx}
              onClose={() => setSelectedTx(null)}
            />
          )}

        </MobileDevice>
      </div>

    </div>
  );
}
