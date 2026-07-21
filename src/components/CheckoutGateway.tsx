/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Lock, 
  CreditCard, 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Check, 
  RotateCcw, 
  FileText, 
  MessageSquare, 
  ChevronDown, 
  Info, 
  X, 
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';

interface CheckoutGatewayProps {
  onAddTransaction: (tx: Transaction) => void;
  onDeductBalance: (amount: number) => void;
  onNavigate: (view: 'home' | 'cards' | 'analytics' | 'swap') => void;
  themeStyle: {
    baseBg: string;
    cardBg: string;
    accentColor: string;
    glowColor: string;
    isLight?: boolean;
  };
}

export const CheckoutGateway: React.FC<CheckoutGatewayProps> = ({
  onAddTransaction,
  onDeductBalance,
  onNavigate,
  themeStyle
}) => {
  const isLight = themeStyle?.isLight;
  
  // Parse dynamic accent color to build background style for Light Mode
  const hexMatch = themeStyle?.accentColor?.match(/#([a-fA-F0-9]{6})/);
  const accentHex = hexMatch ? `#${hexMatch[1]}` : '#1668a8';
  
  // Helper to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 22, g: 104, b: 168 };
  };

  const rgb = hexToRgb(accentHex);

  const darkerRgb = {
    r: Math.round(rgb.r * 0.2),
    g: Math.round(rgb.g * 0.2),
    b: Math.round(rgb.b * 0.2)
  };
  const lighterRgb = {
    r: Math.round(rgb.r * 0.55),
    g: Math.round(rgb.g * 0.55),
    b: Math.round(rgb.b * 0.55)
  };

  const headerBgStyle = {
    background: `linear-gradient(135deg, rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b}) 0%, rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}) 100%)`,
    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`
  };

  // Subdued button calculations for a richer, more deep and elegant color palette
  const buttonSubduedRgb = isLight
    ? {
        r: Math.round(rgb.r * 0.7 + 51 * 0.3),
        g: Math.round(rgb.g * 0.7 + 65 * 0.3),
        b: Math.round(rgb.b * 0.7 + 85 * 0.3),
      }
    : {
        r: Math.round(rgb.r * 0.55 + 30 * 0.45),
        g: Math.round(rgb.g * 0.55 + 41 * 0.45),
        b: Math.round(rgb.b * 0.55 + 59 * 0.45),
      };

  const buttonSubduedHex = `rgb(${buttonSubduedRgb.r}, ${buttonSubduedRgb.g}, ${buttonSubduedRgb.b})`;

  // Dynamic semantic styles for Light/Dark Mode
  const textPrimary = isLight ? 'text-[#0b1329]' : 'text-slate-100';
  const textSecondary = isLight ? 'text-slate-700' : 'text-slate-300';
  const textMuted = isLight ? 'text-slate-500' : 'text-slate-400';
  const textLabel = isLight ? 'text-slate-600 font-semibold' : 'text-slate-300 font-bold';
  const inputBgClass = isLight 
    ? 'bg-white border border-slate-200 text-[#0b1329] placeholder-slate-400 focus:bg-white shadow-xs custom-accent-focus transition-colors' 
    : 'bg-[#0f172a]/75 border border-slate-800/80 text-slate-200 placeholder-slate-600 focus:bg-[#111c35]/50 custom-accent-focus transition-colors';
  const cardBorderClass = isLight ? 'border-slate-200' : 'border-slate-800/40';
  const dividerBorderClass = isLight ? 'bg-slate-200' : 'bg-slate-800/60';
  const selectBgClass = isLight 
    ? 'bg-white border border-slate-200 text-[#0b1329] focus:bg-white custom-accent-focus transition-colors' 
    : 'bg-[#0f172a]/75 border border-slate-800/80 text-slate-200 focus:bg-[#111c35]/50 custom-accent-focus transition-colors';
  const overallBgClass = isLight ? 'text-[#0b1329]' : 'text-[#f1f5f9]';
  const overallBgStyle = isLight 
    ? { background: `radial-gradient(circle at 85% 15%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)` }
    : { background: `radial-gradient(circle at 80% 20%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12) 0%, transparent 55%), linear-gradient(135deg, #020617 0%, #0b1524 50%, #030712 100%)` };

  // Opacity Checkbox Helper Style
  const checkboxStyle = (checked: boolean) => checked 
    ? { 
        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
        borderColor: accentHex,
        color: accentHex
      } 
    : {};

  // Tabs: 'card' | 'ach' | 'other'
  const [activeTab, setActiveTab] = React.useState<'card' | 'ach' | 'other'>('card');

  // Input States
  const [fullName, setFullName] = React.useState('John Doe');
  const [email, setEmail] = React.useState('customer@example.com');
  const [phoneNumber, setPhoneNumber] = React.useState('+1 (555) 000-0000');
  const [cardNumber, setCardNumber] = React.useState('1234 5678 9012 3456');
  const [expiry, setExpiry] = React.useState('12/28');
  const [cvc, setCvc] = React.useState('321');
  const [billingCountry, setBillingCountry] = React.useState('United States');
  const [billingStreet, setBillingStreet] = React.useState('8671 W Flamingo Rd');
  const [billingCity, setBillingCity] = React.useState('Las Vegas');
  const [billingState, setBillingState] = React.useState('NV');
  const [billingPostalCode, setBillingPostalCode] = React.useState('89147');
  
  // Shipping section checkbox
  const [shippingSameAsBilling, setShippingSameAsBilling] = React.useState(true);
  
  // Shipping fields
  const [shippingName, setShippingName] = React.useState('John Doe');
  const [shippingCountry, setShippingCountry] = React.useState('United States');
  const [shippingStreet, setShippingStreet] = React.useState('8671 W Flamingo Rd');
  const [shippingCity, setShippingCity] = React.useState('Las Vegas');
  const [shippingState, setShippingState] = React.useState('NV');
  const [shippingPostalCode, setShippingPostalCode] = React.useState('89147');

  const [poNumber, setPoNumber] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [savePaymentInfo, setSavePaymentInfo] = React.useState(true);
  const [agreeTerms, setAgreeTerms] = React.useState(true);

  // UI States
  const [isPaying, setIsPaying] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [showFeeInfo, setShowFeeInfo] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Validate fields
  const handlePay = () => {
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ tên đầy đủ.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập Email hợp lệ.');
      return;
    }
    if (activeTab === 'card') {
      if (!cardNumber.trim() || cardNumber.length < 16) {
        setErrorMessage('Vui lòng nhập số thẻ thanh toán hợp lệ.');
        return;
      }
      if (!expiry.trim() || !expiry.includes('/')) {
        setErrorMessage('Vui lòng nhập ngày hết hạn MM/YY.');
        return;
      }
      if (!cvc.trim() || cvc.length < 3) {
        setErrorMessage('Vui lòng nhập mã bảo mật CVC hợp lệ.');
        return;
      }
    }
    if (!agreeTerms) {
      setErrorMessage('Bạn phải đồng ý với Điều khoản Sử dụng & Chính sách Bảo mật.');
      return;
    }

    setIsPaying(true);

    // Simulate charging progress
    setTimeout(() => {
      setIsPaying(false);
      setIsSuccess(true);
      
      const chargeAmount = 85.00;
      const techFee = 0.20;
      const totalCharged = chargeAmount + techFee;

      // Create internal transaction record
      const id = `tx-pay-${Date.now()}`;
      const now = new Date();
      const timeString = `Hôm nay, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newTx: Transaction = {
        id,
        title: 'Thanh toán Sunrise Coffee Co.',
        description: 'Đơn hàng #123 (AuxVault Checkout)',
        merchant: 'Sunrise Coffee Co.',
        category: 'Food',
        amount: -totalCharged,
        assetType: 'USD',
        amountInUSD: -totalCharged,
        date: timeString,
        status: 'Completed',
        referenceId: `AUX-PAY-${Math.floor(Math.random() * 89999) + 10000}`,
        fundingSource: 'AuxVault Card (•••• 8824)',
      };

      onAddTransaction(newTx);
      onDeductBalance(totalCharged);
    }, 2000);
  };

  const handleReset = () => {
    setFullName('John Doe');
    setEmail('customer@example.com');
    setPhoneNumber('+1 (555) 000-0000');
    setCardNumber('1234 5678 9012 3456');
    setExpiry('12/28');
    setCvc('321');
    setBillingCountry('United States');
    setBillingStreet('8671 W Flamingo Rd');
    setBillingCity('Las Vegas');
    setBillingState('NV');
    setBillingPostalCode('89147');
    setShippingSameAsBilling(true);
    setShippingName('John Doe');
    setShippingCountry('United States');
    setShippingStreet('8671 W Flamingo Rd');
    setShippingCity('Las Vegas');
    setShippingState('NV');
    setShippingPostalCode('89147');
    setPoNumber('');
    setMessage('');
    setSavePaymentInfo(true);
    setAgreeTerms(true);
    setErrorMessage(null);
  };

  return (
    <div 
      className={`flex-1 flex flex-col overflow-y-auto font-sans relative pb-6 ${overallBgClass}`}
      style={overallBgStyle}
    >
      <style>{`
        .custom-accent-focus:focus {
          border-color: ${accentHex} !important;
          box-shadow: 0 0 0 1px ${accentHex}33 !important;
        }
      `}</style>
      
      {/* Mock Browser URL Bar - Matches exactly pay.auxvault.com/... from image */}
      <div className={`h-10 px-4 ${isLight ? 'bg-slate-100/95 border-slate-200' : 'bg-slate-900/90 border-slate-800/80'} border-b flex items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md`}>
        <svg viewBox="0 0 24 24" className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'} fill-none stroke-current stroke-2`}>
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        
        <div className={`flex-1 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800/80'} border h-7 rounded-full px-3 flex items-center gap-1.5 justify-center max-w-[240px]`}>
          <Lock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
          <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-300'} font-mono tracking-tight overflow-hidden text-ellipsis whitespace-nowrap`}>
            pay.auxvault.com/sunrise-coffee-co/checkout
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`w-4.5 h-4.5 rounded ${isLight ? 'bg-slate-200 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-300'} border flex items-center justify-center text-[9px] font-bold`}>
            1
          </div>
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'} fill-none stroke-current stroke-2`}>
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Merchant Brand Header Banner - Dynamic gradient from dark to light based on selected theme accent color */}
            <div 
              className="px-5 py-4 border-b shadow-[inset_0_-10px_20px_rgba(0,0,0,0.12)] flex items-center gap-3.5 relative overflow-hidden"
              style={headerBgStyle}
            >
              {/* Background ambient lighting */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              
              {/* Profile Image of Barista */}
              <div className="relative z-10 shrink-0">
                <div className="w-11 h-11 rounded-full p-[1px] bg-white/20 shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop" 
                    alt="Sunrise Coffee Co. Merchant Representative" 
                    className="w-full h-full rounded-full object-cover border border-indigo-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Merchant Details */}
              <div className="relative z-10 text-left min-w-0">
                <h2 className="text-[15.5px] font-extrabold text-white tracking-tight leading-snug drop-shadow-sm font-display">
                  Sunrise Coffee Co.
                </h2>
                <p className="text-[11.5px] text-indigo-100 font-medium tracking-tight opacity-90 leading-normal line-clamp-1">
                  8671 W Flamingo Rd Las Vegas, NV 89147
                </p>
              </div>
            </div>

            {/* Main Billing Amount Block */}
            <div className={`p-4 text-center ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/35 border-slate-800/40'} border-b relative`}>
              <div className="flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${isLight ? 'text-[#0a1e35]' : 'text-slate-50'} tracking-tight font-display flex items-baseline justify-center gap-0.5 animate-fade-in`}>
                  <span className={`text-2xl font-bold ${isLight ? 'text-[#0a1e35]/70' : 'text-slate-300'}`}>$</span>
                  85.00
                  <span className={`text-[13.5px] font-bold ${isLight ? 'text-[#0a1e35]/60' : 'text-slate-400'} ml-1`}>USD</span>
                </span>
                
                {/* Tech Fee Indicator */}
                <div className={`flex items-center gap-1.5 mt-1 text-[12px] ${isLight ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
                  <span>Total</span>
                  <span className={`w-1 h-1 rounded-full ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`}></span>
                  <span>Tech Fee <span className={`font-bold ${isLight ? 'text-slate-850' : 'text-slate-200'}`}>$0.20</span></span>
                  <button 
                    onClick={() => setShowFeeInfo(!showFeeInfo)}
                    className={`p-0.5 ${isLight ? 'hover:bg-slate-200' : 'hover:bg-slate-800'} rounded-[6px] transition-colors`}
                  >
                    <Info className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                </div>

                {/* Popover fee info */}
                <AnimatePresence>
                  {showFeeInfo && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute left-1/2 -translate-x-1/2 top-[74px] w-[260px] p-3 rounded-[6px] bg-[#0b1329] border border-amber-500/25 shadow-xl z-20 text-[11.5px] text-slate-300 text-left leading-normal"
                    >
                      <p className="font-semibold text-amber-400 mb-1">Chi tiết Phí Công Nghệ (Tech Fee)</p>
                      Phí bảo chứng phi tập trung $0.20 được áp dụng để đảm bảo giao dịch được bồi hoàn bằng Vàng số vật lý qua hợp đồng AuXPay Vault. Giao dịch an toàn 100%.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Description and Order */}
                <div className="w-full flex items-center justify-between mt-1 text-[12.5px]">
                  <span className="text-slate-400 font-medium">Description:</span>
                  <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'} font-display`}>Order #123</span>
                </div>
              </div>
            </div>

            {/* Fast Checkout Form */}
            <div className="px-5 pt-1 pb-1">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Apple Pay Button */}
                <button 
                  onClick={() => {
                    setFullName('Apple Pay User');
                    setEmail('applepay@icloud.com');
                    handlePay();
                  }}
                  className={`py-2.5 px-3 rounded-[6px] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98 ${
                    isLight 
                      ? 'bg-slate-900 text-white hover:bg-slate-800 border-none' 
                      : 'bg-slate-100 text-slate-950 hover:bg-white border-none'
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94 1.07.08 2.15-.52 2.81-1.33z" />
                  </svg>
                  <span className="text-[13.5px] font-bold font-display tracking-tight">Apple Pay</span>
                </button>

                {/* Google Pay Button */}
                <button 
                  onClick={() => {
                    setFullName('Google Pay User');
                    setEmail('googlepay@gmail.com');
                    handlePay();
                  }}
                  className={`py-2.5 px-3 rounded-[6px] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98 ${
                    isLight 
                      ? 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200/80' 
                      : 'bg-slate-100 text-slate-900 hover:bg-white border-none'
                  }`}
                >
                  <div className="flex items-center gap-1.5 justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.23-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span className="text-[13.5px] font-bold font-display tracking-tight">Google Pay</span>
                  </div>
                </button>
              </div>

              {/* Or Pay With Divider */}
              <div className="flex items-center justify-center gap-3 my-3">
                <div className={`h-[1px] flex-1 ${isLight ? 'bg-slate-400' : 'bg-white/90'}`}></div>
                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isLight ? 'text-slate-600' : 'text-white'}`}>Or pay with</span>
                <div className={`h-[1px] flex-1 ${isLight ? 'bg-slate-400' : 'bg-white/90'}`}></div>
              </div>

              {/* Tabs for Payment Methods: Card, ACH, Other */}
              <div className={`grid grid-cols-3 gap-1 ${
                isLight 
                  ? 'bg-white/70 backdrop-blur-md shadow-[0_3px_12px_rgba(0,0,0,0.06)] border-none' 
                  : 'bg-slate-800/35 shadow-[0_4px_16px_rgba(0,0,0,0.25)] border-none'
              } p-1.5 mb-3 rounded-[6px]`} id="checkout-tabs">
                <button 
                  onClick={() => setActiveTab('card')}
                  className={`py-2 text-center flex flex-col items-center gap-1.5 relative rounded-[6px] transition-all duration-200 ${
                    activeTab === 'card' 
                      ? (isLight ? 'bg-white shadow-sm font-extrabold' : 'bg-slate-800/90 shadow-md font-extrabold border border-white/5') 
                      : (isLight 
                          ? 'text-slate-600 hover:bg-white/40 hover:scale-[1.03] active:scale-[0.97]' 
                          : 'text-slate-400 hover:bg-slate-800/40 hover:scale-[1.03] active:scale-[0.97]')
                  }`}
                  style={{ color: activeTab === 'card' ? accentHex : undefined }}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[12px] font-bold">Card</span>
                  {activeTab === 'card' && (
                    <motion.div layoutId="checkout-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: accentHex }}></motion.div>
                  )}
                </button>

                <button 
                  onClick={() => setActiveTab('ach')}
                  className={`py-2 text-center flex flex-col items-center gap-1.5 relative rounded-[6px] transition-all duration-200 ${
                    activeTab === 'ach' 
                      ? (isLight ? 'bg-white shadow-sm font-extrabold' : 'bg-slate-800/90 shadow-md font-extrabold border border-white/5') 
                      : (isLight 
                          ? 'text-slate-600 hover:bg-white/40 hover:scale-[1.03] active:scale-[0.97]' 
                          : 'text-slate-400 hover:bg-slate-800/40 hover:scale-[1.03] active:scale-[0.97]')
                  }`}
                  style={{ color: activeTab === 'ach' ? accentHex : undefined }}
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="text-[12px] font-bold">ACH / Check</span>
                  {activeTab === 'ach' && (
                    <motion.div layoutId="checkout-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: accentHex }}></motion.div>
                  )}
                </button>

                <button 
                  onClick={() => setActiveTab('other')}
                  className={`py-2 text-center flex flex-col items-center gap-1.5 relative rounded-[6px] transition-all duration-200 ${
                    activeTab === 'other' 
                      ? (isLight ? 'bg-white shadow-sm font-extrabold' : 'bg-slate-800/90 shadow-md font-extrabold border border-white/5') 
                      : (isLight 
                          ? 'text-slate-600 hover:bg-white/40 hover:scale-[1.03] active:scale-[0.97]' 
                          : 'text-slate-400 hover:bg-slate-800/40 hover:scale-[1.03] active:scale-[0.97]')
                  }`}
                  style={{ color: activeTab === 'other' ? accentHex : undefined }}
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-[12px] font-bold">Other ways</span>
                  {activeTab === 'other' && (
                    <motion.div layoutId="checkout-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: accentHex }}></motion.div>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="mx-5 mb-3.5 p-3 rounded-[6px] bg-rose-950/20 border border-rose-900/30 text-rose-400 text-[12px] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Fields Scroller Area */}
            <div className="px-5 space-y-3 text-left">
              
              {activeTab === 'card' && (
                <>
                  {/* Full Name input */}
                  <div className="space-y-1">
                    <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none`}
                      />
                    </div>
                  </div>

                  {/* Email & Phone side-by-side */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="customer@example"
                          className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                        <input 
                          type="text" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="1 (555) 000 0000"
                          className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Details with secure badge */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className={`text-[12px] ${textLabel} uppercase tracking-wider`}>Card Details</label>
                      <span className="text-[12px] font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-[6px]">
                        <Lock className="w-2.5 h-2.5" /> Secure
                      </span>
                    </div>

                    {/* Card Number */}
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] font-mono tracking-wider focus:outline-none`}
                      />
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className={`w-full ${inputBgClass} rounded-[6px] py-2 px-3 text-[13px] text-center font-mono focus:outline-none`}
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          placeholder="CVC"
                          className={`w-full ${inputBgClass} rounded-[6px] py-2 px-3 text-[13px] text-center font-mono focus:outline-none`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Address Section */}
                  <div className="space-y-1.5 pt-1">
                    <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Billing Address</label>
                    
                    {/* Country Selector dropdown */}
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <select 
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className={`w-full ${selectBgClass} rounded-[6px] py-2 pl-9 pr-8 text-[13px] appearance-none focus:outline-none`}
                      >
                        <option value="United States" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>United States</option>
                        <option value="Vietnam" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Vietnam</option>
                        <option value="Canada" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Canada</option>
                        <option value="Singapore" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Singapore</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>

                    {/* Street address */}
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        value={billingStreet}
                        onChange={(e) => setBillingStreet(e.target.value)}
                        placeholder="Street address"
                        className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none`}
                      />
                    </div>

                    {/* City / State / Postal Code side-by-side */}
                    <div className="grid grid-cols-3 gap-2">
                      <input 
                        type="text" 
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        placeholder="City"
                        className={`${inputBgClass} rounded-[6px] py-2 px-2.5 text-[13px] focus:outline-none`}
                      />
                      <input 
                        type="text" 
                        value={billingState}
                        onChange={(e) => setBillingState(e.target.value)}
                        placeholder="State"
                        className={`${inputBgClass} rounded-[6px] py-2 px-2.5 text-[13px] focus:outline-none`}
                      />
                      <input 
                        type="text" 
                        value={billingPostalCode}
                        onChange={(e) => setBillingPostalCode(e.target.value)}
                        placeholder="Postal Code"
                        className={`${inputBgClass} rounded-[6px] py-2 px-2.5 text-[13px] focus:outline-none`}
                      />
                    </div>
                  </div>

                  {/* Checkbox shipping address same as billing */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button 
                      onClick={() => setShippingSameAsBilling(!shippingSameAsBilling)}
                      className={`w-4.5 h-4.5 rounded-[2px] flex items-center justify-center transition-all ${
                        shippingSameAsBilling 
                          ? 'border text-white' 
                          : `${isLight ? 'border border-slate-300 bg-white hover:bg-slate-50' : 'border border-slate-700 bg-[#1e293b]/40'}`
                      }`}
                      style={checkboxStyle(shippingSameAsBilling)}
                    >
                      {shippingSameAsBilling && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                    </button>
                    <span className={`text-[12.5px] ${textMuted} font-medium`}>Shipping information is the same as billing</span>
                  </div>

                  {/* Shipping Address Expanded section */}
                  <AnimatePresence>
                    {!shippingSameAsBilling && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`space-y-1.5 pt-1.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/40'} mt-1 overflow-hidden`}
                      >
                        <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Shipping Address</label>
                        
                        {/* Shipping name */}
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            placeholder="Shipping Name"
                            className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none`}
                          />
                        </div>

                        {/* Country */}
                        <div className="relative">
                          <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                          <select 
                            value={shippingCountry}
                            onChange={(e) => setShippingCountry(e.target.value)}
                            className={`w-full ${selectBgClass} rounded-[6px] py-2 pl-9 pr-8 text-[13px] appearance-none focus:outline-none`}
                          >
                            <option value="United States" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>United States</option>
                            <option value="Vietnam" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Vietnam</option>
                            <option value="Canada" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Canada</option>
                            <option value="Singapore" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Singapore</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                        </div>

                        {/* Shipping Street address */}
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            value={shippingStreet}
                            onChange={(e) => setShippingStreet(e.target.value)}
                            placeholder="Shipping address"
                            className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none`}
                          />
                        </div>

                        {/* Shipping City / State / Postal Code */}
                        <div className="grid grid-cols-3 gap-2">
                          <input 
                            type="text" 
                            value={shippingCity}
                            onChange={(e) => setShippingCity(e.target.value)}
                            placeholder="City"
                            className={`${inputBgClass} rounded-[6px] py-2 px-2.5 text-[13px] focus:outline-none`}
                          />
                          <input 
                            type="text" 
                            value={shippingState}
                            onChange={(e) => setShippingState(e.target.value)}
                            placeholder="State"
                            className={`${inputBgClass} rounded-[6px] py-2 px-2.5 text-[13px] focus:outline-none`}
                          />
                          <input 
                            type="text" 
                            value={shippingPostalCode}
                            onChange={(e) => setShippingPostalCode(e.target.value)}
                            placeholder="Postal Code"
                            className={`${inputBgClass} rounded-[6px] py-2 px-2.5 text-[13px] focus:outline-none`}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {activeTab === 'ach' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5"
                >
                  <p className={`text-[12.5px] ${textMuted} font-medium`}>Thanh toán trực tiếp bằng tài khoản ngân hàng liên kết.</p>
                  
                  <div className="space-y-1">
                    <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Routing Number</label>
                    <input 
                      type="text" 
                      placeholder="021000021 (Mã ngân hàng)"
                      className={`w-full ${inputBgClass} rounded-[6px] py-2 px-3 text-[13px] focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Account Number</label>
                    <input 
                      type="text" 
                      placeholder="Số tài khoản ngân hàng"
                      className={`w-full ${inputBgClass} rounded-[6px] py-2 px-3 text-[13px] focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Account Type</label>
                    <select className={`w-full ${selectBgClass} rounded-[6px] py-2 px-3 text-[13px] focus:outline-none`}>
                      <option value="checking" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Checking (Tài khoản vãng lai)</option>
                      <option value="savings" className={`${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>Savings (Tài khoản tiết kiệm)</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {activeTab === 'other' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`space-y-1.5 p-3.5 rounded-[6px] border border-dashed ${isLight ? 'border-slate-300' : 'border-slate-800'} text-center`}
                >
                  <HelpCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className={`text-[13px] font-bold ${textPrimary}`}>Phương thức khác</p>
                  <p className={`text-[11.5px] ${textMuted} leading-normal`}>
                    Hỗ trợ quét mã QR qua ngân hàng Việt Nam, ví điện tử MOMO, ZaloPay, hoặc số dư vàng kỹ thuật số AuXPay.
                  </p>
                </motion.div>
              )}

              {/* PO / Invoice Number */}
              <div className="space-y-1 pt-0.5">
                <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>PO / Invoice Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="Enter PO / Invoice number"
                    className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none`}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className={`text-[12px] ${textLabel} uppercase tracking-wider block`}>Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                    rows={2}
                    className={`w-full ${inputBgClass} rounded-[6px] py-2 pl-9 pr-4 text-[13px] focus:outline-none resize-none`}
                  />
                </div>
              </div>

              {/* Checkbox Save my info */}
              <div className="flex items-center gap-2 pt-0.5">
                <button 
                  onClick={() => setSavePaymentInfo(!savePaymentInfo)}
                  className={`w-4.5 h-4.5 rounded-[2px] flex items-center justify-center transition-all ${
                    savePaymentInfo 
                      ? 'border text-white' 
                      : `${isLight ? 'border border-slate-300 bg-white hover:bg-slate-50' : 'border border-slate-700 bg-[#1e293b]/40'}`
                  }`}
                  style={checkboxStyle(savePaymentInfo)}
                >
                  {savePaymentInfo && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                </button>
                <span className={`text-[12.5px] ${textMuted} font-medium`}>Save my payment info for future payments</span>
              </div>

              {/* Checkbox Agree terms */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4.5 h-4.5 rounded-[2px] flex items-center justify-center transition-all ${
                    agreeTerms 
                      ? 'border text-white' 
                      : `${isLight ? 'border border-slate-300 bg-white hover:bg-slate-50' : 'border border-slate-700 bg-[#1e293b]/40'}`
                  }`}
                  style={checkboxStyle(agreeTerms)}
                >
                  {agreeTerms && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                </button>
                <span className={`text-[12.5px] ${textMuted} font-medium`}>
                  I agree to all <span className="underline font-semibold cursor-pointer" style={{ color: accentHex }}>Terms of Use</span> & <span className="text-amber-500 underline font-semibold cursor-pointer">Privacy Policy</span>
                </span>
              </div>

              {/* Footer action buttons: Reset / Pay: $85.00 */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 font-display">
                <button 
                  onClick={handleReset}
                  className="py-2.5 rounded-[6px] text-[13px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 border"
                  style={{
                    backgroundColor: `rgba(${buttonSubduedRgb.r}, ${buttonSubduedRgb.g}, ${buttonSubduedRgb.b}, 0.12)`,
                    borderColor: `rgba(${buttonSubduedRgb.r}, ${buttonSubduedRgb.g}, ${buttonSubduedRgb.b}, 0.35)`,
                    color: isLight ? '#334155' : '#e2e8f0'
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button 
                  onClick={handlePay}
                  disabled={isPaying}
                  className="col-span-2 py-2.5 rounded-[6px] disabled:opacity-50 text-[13.5px] font-extrabold transition-all flex items-center justify-center gap-2 active:scale-98 relative overflow-hidden"
                  style={{ 
                    backgroundColor: buttonSubduedHex,
                    color: '#ffffff',
                    boxShadow: `0 4px 14px rgba(${buttonSubduedRgb.r}, ${buttonSubduedRgb.g}, ${buttonSubduedRgb.b}, 0.25)`
                  }}
                >
                  {isPaying ? (
                    <>
                      <div className="w-4.5 h-4.5 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Pay: $85.00</span>
                  )}
                </button>
              </div>

              {/* Secure checkout badges & legal warning */}
              <div className="pt-4 pb-2 text-center space-y-2.5">
                <div className="flex items-center justify-center gap-4 opacity-75">
                  {/* VISA badge */}
                  <span className="text-[13px] font-extrabold text-blue-600 tracking-tighter italic">VISA</span>
                  {/* MasterCard badge */}
                  <div className="flex items-center gap-1">
                    <span className="flex">
                      <span className="w-3 h-3 rounded-full bg-red-500 -mr-1"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    </span>
                    <span className={`text-[11.5px] font-bold ${isLight ? 'text-[#0b1329]' : 'text-slate-300'}`}>mastercard</span>
                  </div>
                  {/* PCI-DSS Badge */}
                  <span className={`text-[11.5px] font-bold ${textMuted} flex items-center gap-0.5 ${isLight ? 'bg-slate-100' : 'bg-slate-800/40'} px-1.5 py-0.5 rounded-[6px] border ${isLight ? 'border-slate-200' : 'border-slate-700/20'}`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> PCI
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-400 leading-normal max-w-[280px] mx-auto">
                  Payments are securely processed. Your card data never touches our servers.
                </p>
              </div>

            </div>
          </motion.div>
        ) : (
          /* Payment Success Screen with beautiful animations */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[#0b1329]"
              >
                <Check className="w-6 h-6 stroke-[3.5] text-[#0b1329]" />
              </motion.div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping"></div>
            </div>

            <span className="text-[12px] text-emerald-500 uppercase tracking-widest font-bold font-mono">AuxVault Payment Gateway</span>
            <h3 className={`text-xl font-bold ${isLight ? 'text-slate-950' : 'text-slate-100'} font-display mt-1.5`}>Giao dịch thành công</h3>
            
            <p className={`text-[13.5px] ${textMuted} leading-relaxed max-w-[240px] mt-2`}>
              Đã thanh toán hóa đơn mua hàng tại <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Sunrise Coffee Co.</span>
            </p>

            <div className={`p-4 rounded-[6px] ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1e293b]/35 border-slate-800/60'} border w-full my-6 text-left space-y-2.5`}>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500">Mã đơn hàng</span>
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>#123</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500">Mã tham chiếu</span>
                <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>TX-AUX-{Math.floor(Math.random() * 89999) + 10000}</span>
              </div>
              <div className={`flex justify-between text-[13px] pt-1.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/40'}`}>
                <span className="text-slate-500 font-bold">Tổng thanh toán</span>
                <span className="font-bold text-emerald-500 font-mono">$85.20</span>
              </div>
              <div className="text-[11px] text-slate-400 text-center pt-1 italic">
                * Bao gồm $0.20 phí bảo chứng AuXPay Tech Fee
              </div>
            </div>

            <button 
              onClick={() => {
                setIsSuccess(false);
                handleReset();
              }}
              className="w-full py-2.5 rounded-[6px] font-bold text-sm transition-all active:scale-95 shadow-md font-display"
              style={{
                backgroundColor: buttonSubduedHex,
                color: '#ffffff',
                boxShadow: `0 4px 14px rgba(${buttonSubduedRgb.r}, ${buttonSubduedRgb.g}, ${buttonSubduedRgb.b}, 0.25)`
              }}
            >
              Thực hiện giao dịch mới
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
