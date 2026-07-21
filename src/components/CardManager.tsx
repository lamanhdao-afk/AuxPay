/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, Transaction } from '../types';
import { 
  Lock, 
  Unlock, 
  Copy, 
  Eye, 
  EyeOff, 
  Settings, 
  Check, 
  FlameKindling, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { motion } from 'motion/react';

interface CardManagerProps {
  cards: CreditCard[];
  transactions: Transaction[];
  onToggleFreeze: (cardId: string) => void;
  onUpdateLimit: (cardId: string, value: number) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const CardManager: React.FC<CardManagerProps> = ({
  cards,
  transactions,
  onToggleFreeze,
  onUpdateLimit,
  onSelectTransaction,
}) => {
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);
  const [revealDetails, setRevealDetails] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const activeCard = cards[activeCardIndex];

  // Copy card number to clipboard simulation
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter transactions specifically for this card
  const cardTransactions = transactions.filter(tx => {
    if (activeCard.type === 'GOLD_METAL') {
      return tx.fundingSource.includes('Savings') || tx.fundingSource.includes('Cash');
    } else if (activeCard.type === 'TITANIUM_DEBIT') {
      return tx.fundingSource.includes('4192');
    }
    return false; // virtual card is frozen / no transactions
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 font-sans">
      {/* View Title */}
      <div className="py-4 flex items-center justify-between" id="cards-header">
        <div>
          <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest block">Thẻ Kim Loại</span>
          <h2 className="text-lg font-bold text-slate-100 font-display">Quản Lý Thẻ Metal</h2>
        </div>
        <button className="w-8.5 h-8.5 rounded-full bg-slate-800/40 border border-slate-700/20 flex items-center justify-center hover:bg-slate-800/80 active:scale-95 transition-all">
          <Settings className="w-4 h-4 text-slate-300" />
        </button>
      </div>

      {/* Cards Slider Carousel */}
      <div className="relative mb-6">
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none px-1">
          {cards.map((card, idx) => {
            const isActive = idx === activeCardIndex;
            
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveCardIndex(idx);
                  setRevealDetails(false);
                }}
                className={`flex-shrink-0 w-[295px] h-[180px] rounded-2xl p-5 relative overflow-hidden cursor-pointer snap-center transition-all duration-300 select-none ${
                  isActive 
                    ? 'scale-[1.02] shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-slate-700/50' 
                    : 'scale-[0.93] opacity-50 bg-slate-900 border border-transparent'
                }`}
                style={{
                  background: card.color,
                }}
              >
                {/* Metallic Sheen Effect overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: card.metallicSheen }}
                ></div>

                {/* Cyber Glow or Gold accents for specific card types */}
                {card.type === 'GOLD_METAL' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                )}
                {card.type === 'CYBER_EMERALD' && (
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                )}

                {/* Card Brand Header */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold tracking-widest text-slate-100 font-display uppercase">AUX PAY</span>
                    <span className="text-[8px] tracking-wider text-slate-400 font-medium">
                      {card.type === 'GOLD_METAL' ? 'Premium 18K Gold Metal' : card.type === 'TITANIUM_DEBIT' ? 'Heavy Titanium' : 'Virtual Disposable'}
                    </span>
                  </div>

                  {/* Visa/MC custom logo representation */}
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-amber-500/80 mix-blend-screen -mr-2.5"></div>
                    <div className="w-6 h-6 rounded-full bg-amber-600/80 mix-blend-screen"></div>
                  </div>
                </div>

                {/* Chip and Wireless Contactless Icon */}
                <div className="mt-4 flex items-center justify-between relative z-10">
                  {/* Card Chip Mockup */}
                  <div className="w-8 h-6 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 p-[1px] relative">
                    <div className="w-full h-full bg-amber-500/10 rounded-[5px] grid grid-cols-3 gap-[1px] p-1">
                      <div className="border border-amber-600/30 rounded-sm"></div>
                      <div className="border border-amber-600/30 rounded-sm"></div>
                      <div className="border border-amber-600/30 rounded-sm"></div>
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-slate-400/80 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                {/* Card Number */}
                <div className="mt-4 relative z-10">
                  <span className="text-sm font-bold font-mono tracking-[4px] text-slate-100">
                    {revealDetails && isActive ? '4219 8812 3901 8824' : card.number}
                  </span>
                </div>

                {/* Expiry, CVV, Cardholder */}
                <div className="mt-3 flex items-end justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[7.5px] text-slate-400 uppercase tracking-widest">Cardholder</span>
                    <span className="text-[10px] font-bold text-slate-200 tracking-tight">{card.cardholder}</span>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[7.5px] text-slate-400 uppercase tracking-widest">Expires</span>
                      <span className="text-[10px] font-bold text-slate-200 tracking-tight">{card.expiry}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7.5px] text-slate-400 uppercase tracking-widest">CVV</span>
                      <span className="text-[10px] font-bold text-slate-200 tracking-tight">
                        {revealDetails && isActive ? card.cvv : '•••'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Frozen Badge */}
                {card.isFrozen && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                    <Lock className="w-6 h-6 text-amber-500 mb-1" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Đã khóa tạm thời</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-1.5 mt-1">
          {cards.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all ${idx === activeCardIndex ? 'w-5 bg-amber-500' : 'w-1.5 bg-slate-700'}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Card Details Quick Toolbar */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <button 
          onClick={() => setRevealDetails(!revealDetails)}
          disabled={activeCard.isFrozen}
          className="p-2.5 rounded-xl glass-button flex flex-col items-center gap-1.5 text-center text-slate-300 disabled:opacity-40 disabled:pointer-events-none"
        >
          {revealDetails ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-slate-300" />}
          <span className="text-[9.5px] font-medium leading-tight">Hiện thông tin</span>
        </button>

        <button 
          onClick={handleCopy}
          disabled={activeCard.isFrozen}
          className="p-2.5 rounded-xl glass-button flex flex-col items-center gap-1.5 text-center text-slate-300 disabled:opacity-40 disabled:pointer-events-none"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Copy className="w-4 h-4 text-slate-300" />}
          <span className="text-[9.5px] font-medium leading-tight">{copied ? 'Đã sao chép!' : 'Sao chép số'}</span>
        </button>

        <button 
          onClick={() => onToggleFreeze(activeCard.id)}
          className="p-2.5 rounded-xl glass-button flex flex-col items-center gap-1.5 text-center text-slate-300"
        >
          {activeCard.isFrozen ? (
            <>
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span className="text-[9.5px] font-medium leading-tight">Mở khóa thẻ</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-rose-400" />
              <span className="text-[9.5px] font-medium leading-tight">Khóa thẻ</span>
            </>
          )}
        </button>
      </div>

      {/* Card spending limit setting */}
      <div className="p-4 rounded-2xl glass-panel mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-300">Hạn mức chi tiêu</span>
          </div>
          <span className="text-xs font-bold text-amber-500">
            ${activeCard.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })} / ${activeCard.limit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <input 
          type="range" 
          min="5000" 
          max="150000" 
          step="5000"
          value={activeCard.limit}
          disabled={activeCard.isFrozen}
          onChange={(e) => onUpdateLimit(activeCard.id, parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
        />

        <div className="flex items-center justify-between mt-2.5 text-[9.5px] text-slate-500 font-medium">
          <span>Min: $5,000</span>
          <span>Max: $150,000</span>
        </div>
      </div>

      {/* Card Specific Statement / Transactions */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Lịch sử thẻ này</h5>
          <span className="text-[10px] text-slate-400">Giao dịch sao kê</span>
        </div>

        {cardTransactions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-700/30 rounded-2xl glass-panel text-center">
            <AlertCircle className="w-5 h-5 text-slate-500 mb-1.5" />
            <p className="text-xs font-semibold text-slate-400">Không có giao dịch</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Thẻ này hiện tại chưa phát sinh giao dịch chi tiêu.</p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-[170px] pr-1">
            {cardTransactions.map((tx) => {
              const isExpense = tx.amount < 0;
              return (
                <div 
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="p-2.5 rounded-xl glass-panel hover:bg-slate-800/15 hover:border-slate-500/20 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-[10.5px] font-bold text-slate-300">
                      {tx.category.charAt(0)}
                    </div>
                    <div>
                      <h6 className="text-[11px] font-bold text-slate-200 line-clamp-1">{tx.title}</h6>
                      <p className="text-[8.5px] text-slate-500">{tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[11px] font-bold ${isExpense ? 'text-slate-300' : 'text-emerald-400'}`}>
                      {isExpense ? '' : '+'}{tx.amount.toLocaleString('en-US')} $
                    </span>
                    <p className="text-[8px] text-slate-500 mt-0.5">Thành công</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
