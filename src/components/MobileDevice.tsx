/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

interface MobileDeviceProps {
  children: React.ReactNode;
  themeStyle: {
    baseBg: string;
    cardBg: string;
    accentColor: string;
    headerBg: string;
  };
}

export const MobileDevice: React.FC<MobileDeviceProps> = ({ children, themeStyle }) => {
  const [time, setTime] = React.useState('19:45');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto my-4 max-w-[390px] w-full aspect-[9/19.5] bg-slate-950 rounded-[55px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 outline-[4px] outline-slate-900/50 flex flex-col overflow-hidden select-none select-none">
      {/* Speaker and Camera Notch (Dynamic Island Look) */}
      <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-full z-50 flex items-center justify-between px-3.5 border border-slate-800/30">
        <div className="w-3 h-3 rounded-full bg-slate-900 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-900/80"></div>
        </div>
        <div className="w-12 h-1 bg-neutral-900 rounded-full"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/10 animate-pulse flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
        </div>
      </div>

      {/* Screen Container */}
      <div 
        className={`w-full h-full rounded-[45px] overflow-hidden flex flex-col relative transition-all duration-500 ${themeStyle.baseBg} ${themeStyle.isLight ? 'text-slate-900' : 'text-slate-100'}`}
        id="mobile-screen-body"
      >
        {/* Status Bar */}
        <div className={`h-[44px] px-6 pt-3 flex items-center justify-between ${themeStyle.isLight ? 'text-slate-700' : 'text-slate-300'} font-sans text-xs font-semibold tracking-tight select-none z-40`}>
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal className={`w-3.5 h-3.5 ${themeStyle.isLight ? 'text-slate-700' : 'text-slate-300'}`} />
            <span className="text-[10px] opacity-85">5G</span>
            <Wifi className={`w-3.5 h-3.5 ${themeStyle.isLight ? 'text-slate-700' : 'text-slate-300'}`} />
            <div className={`flex items-center gap-0.5 ${themeStyle.isLight ? 'bg-slate-200/80' : 'bg-slate-800/50'} px-1 py-0.5 rounded-sm border ${themeStyle.isLight ? 'border-slate-300/60' : 'border-slate-700/20'}`}>
              <Battery className={`w-4 h-4 ${themeStyle.isLight ? 'text-slate-700' : 'text-slate-300'} rotate-0`} />
            </div>
          </div>
        </div>

        {/* Main Phone Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="h-[20px] w-full flex items-center justify-center pb-2 z-40 bg-transparent">
          <div className="w-[120px] h-[5px] bg-slate-500/40 rounded-full"></div>
        </div>
      </div>

      {/* Side Buttons (Vol Up, Vol Down, Power) for realism */}
      <div className="absolute left-[-10px] top-[120px] w-[4px] h-[35px] bg-slate-700 rounded-r-md"></div>
      <div className="absolute left-[-10px] top-[165px] w-[4px] h-[50px] bg-slate-700 rounded-r-md"></div>
      <div className="absolute left-[-10px] top-[225px] w-[4px] h-[50px] bg-slate-700 rounded-r-md"></div>
      <div className="absolute right-[-10px] top-[180px] w-[4px] h-[70px] bg-slate-700 rounded-l-md"></div>
    </div>
  );
};
