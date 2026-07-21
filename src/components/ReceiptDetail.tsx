/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Transaction } from '../types';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Download, 
  MapPin, 
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ReceiptDetailProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptDetail: React.FC<ReceiptDetailProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const handleCopyRef = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpense = transaction.amount < 0;

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col justify-end">
      {/* Background click dismiss */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide up receipt panel */}
      <div 
        className="w-full glass-panel rounded-t-[32px] p-5 relative z-10 border-t border-slate-700/40 flex flex-col max-h-[88%] shadow-[0_-15px_40px_rgba(0,0,0,0.6)] animate-slide-up"
        id="receipt-panel"
      >
        {/* Notch / Drag Bar */}
        <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose}></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass-button flex items-center justify-center"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        {/* Receipt Header / Merchant */}
        <div className="text-center pt-2 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center font-display text-base font-bold text-amber-500 mb-2.5">
            {transaction.title.charAt(0)}
          </div>
          <h3 className="text-sm font-extrabold text-slate-100 font-display">{transaction.merchant}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{transaction.description}</p>
        </div>

        {/* Big Amount */}
        <div className="py-4 border-y border-dashed border-slate-800/60 text-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Số tiền thanh toán</span>
          <span className={`text-2xl font-extrabold font-mono tracking-tight ${isExpense ? 'text-slate-100' : 'text-emerald-400'}`}>
            {isExpense ? '' : '+'}{transaction.amount.toLocaleString()} 
            <span className="text-sm font-semibold text-slate-400 ml-1">{transaction.assetType}</span>
          </span>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">
            ~${Math.abs(transaction.amountInUSD).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </p>
        </div>

        {/* Metadata Grid Table */}
        <div className="py-4 space-y-3 flex-1 overflow-y-auto max-h-[220px]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Trạng thái</span>
            {transaction.status === 'Completed' ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9.5px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
              </span>
            ) : transaction.status === 'Pending' ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9.5px] font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Chờ xử lý
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[9.5px] font-bold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Thất bại
              </span>
            )}
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Thời gian giao dịch</span>
            <span className="text-slate-300 font-semibold">{transaction.date}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Danh mục</span>
            <span className="text-slate-300 font-semibold">{transaction.category}</span>
          </div>

          <div className="flex justify-between items-start text-xs">
            <span className="text-slate-500 font-medium">Nguồn thanh toán</span>
            <span className="text-slate-300 font-semibold text-right max-w-[180px] line-clamp-1">{transaction.fundingSource}</span>
          </div>

          {/* Reference copy block */}
          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-800/40">
            <span className="text-slate-500 font-medium">Mã tham chiếu</span>
            <button 
              onClick={handleCopyRef}
              className="px-2 py-1 rounded-lg glass-button text-[10px] font-mono text-slate-300 flex items-center gap-1"
            >
              {copied ? 'Đã sao chép' : transaction.referenceId}
              <Copy className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Fake GPS Map Representation for premium polish */}
          <div className="mt-3 p-3 rounded-2xl glass-panel relative overflow-hidden flex items-center gap-2.5">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {/* Custom SVG grid lines resembling a map */}
              <svg width="100%" height="100%">
                <path d="M0,10 H300 M0,30 H300 M0,50 H300 M0,70 H300 M30,0 V100 M90,0 V100 M150,0 V100 M210,0 V100" stroke="#FFFFFF" strokeWidth="1"/>
                <circle cx="120" cy="40" r="25" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 relative z-10">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Vị trí giao dịch</span>
              <span className="text-xs text-slate-300 font-semibold">San Francisco, CA, USA</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 ml-auto relative z-10" />
          </div>
        </div>

        {/* Receipt Quick Actions Footer */}
        <div className="pt-4 border-t border-slate-800/40 grid grid-cols-2 gap-3 mt-auto">
          <button 
            onClick={onClose}
            className="py-3 px-4 rounded-xl glass-button text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Tải biên lai
          </button>
          <button 
            onClick={() => alert("Chúng tôi đã tiếp nhận yêu cầu khiếu nại giao dịch này.")}
            className="py-3 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <AlertTriangle className="w-4 h-4" /> Báo cáo sự cố
          </button>
        </div>
      </div>
    </div>
  );
};
