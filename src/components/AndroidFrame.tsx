import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  isDarkMode: boolean;
  language: 'fa' | 'en';
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFrameMode,
  onToggleFrameMode,
  isDarkMode,
  language,
}) => {
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-0 md:p-6 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#121214] text-white' : 'bg-[#f4f3ee] text-slate-900'
    } relative overflow-x-hidden selection:bg-blue-600 selection:text-white`}>
      {/* Top Desktop Controls Bar */}
      <div className={`hidden md:flex items-center justify-between w-full max-w-md mb-3 px-4 py-2 rounded-2xl border shadow-sm text-xs ${
        isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
          <span className="font-extrabold text-sm">
            {language === 'fa' ? 'ماشین حساب شیک آیفون' : 'NovaCalc iOS Style'}
          </span>
        </div>

        <button
          onClick={onToggleFrameMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
            isDarkMode ? 'bg-[#2c2c2e] text-blue-400 hover:text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
        >
          {isFrameMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'fa' ? 'نمای گسترده' : 'Full Screen'}</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'fa' ? 'قالب گوشی' : 'Phone Frame'}</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      {isFrameMode ? (
        <div className="relative group transition-all duration-300">
          {/* Subtle phone hardware volume & power buttons on the sides */}
          <div className="hidden md:block absolute -left-1.5 top-28 w-1 h-12 bg-slate-400/60 rounded-l-sm" />
          <div className="hidden md:block absolute -left-1.5 top-44 w-1 h-12 bg-slate-400/60 rounded-l-sm" />
          <div className="hidden md:block absolute -right-1.5 top-32 w-1 h-16 bg-slate-400/60 rounded-r-sm" />

          {/* Smartphone Chassis */}
          <div className={`w-full md:w-[410px] h-screen md:h-[830px] md:max-h-[92vh] rounded-none md:rounded-[48px] border-0 md:border-[10px] ${
            isDarkMode ? 'bg-black border-[#2c2c2e] shadow-2xl' : 'bg-[#faf9f5] border-slate-300 shadow-2xl'
          } flex flex-col overflow-hidden relative ring-1 ring-slate-300/40`}>
            {/* Dynamic Island / Pill Camera Notch at top */}
            <div className={`hidden md:flex justify-center pt-2.5 pb-0.5 ${
              isDarkMode ? 'bg-black' : 'bg-[#faf9f5]'
            }`}>
              <div className="w-24 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-between px-2.5 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                <div className="w-2 h-2 rounded-full bg-blue-950" />
              </div>
            </div>

            {/* Screen Area */}
            <div className={`flex-1 flex flex-col overflow-hidden relative ${
              isDarkMode ? 'bg-black' : 'bg-[#faf9f5]'
            }`}>
              {children}
            </div>

            {/* Home Bar Pill */}
            <div className={`w-full flex justify-center py-2 ${
              isDarkMode ? 'bg-black' : 'bg-[#faf9f5]'
            }`}>
              <div className="w-32 h-1 rounded-full bg-slate-400/50 active:bg-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      ) : (
        /* Expanded full view mode */
        <div className={`w-full max-w-4xl min-h-screen md:min-h-[800px] rounded-none md:rounded-3xl border-0 md:border ${
          isDarkMode ? 'bg-black border-[#2c2c2e]' : 'bg-[#faf9f5] border-slate-200'
        } shadow-xl flex flex-col overflow-hidden relative`}>
          <div className={`flex-1 flex flex-col overflow-hidden relative ${
            isDarkMode ? 'bg-black' : 'bg-[#faf9f5]'
          }`}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
