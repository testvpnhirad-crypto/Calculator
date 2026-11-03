import React from 'react';
import { Menu, History, Settings, Sparkles, Calculator, ArrowRight, Sun, Moon } from 'lucide-react';
import { CalculatorMode } from '../types';

interface AndroidHeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  onOpenDrawer: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  historyCount: number;
  language: 'fa' | 'en';
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenDrawer,
  onOpenHistory,
  onOpenSettings,
  onToggleDarkMode,
  isDarkMode,
  historyCount,
  language,
}) => {
  const isFa = language === 'fa';

  const getModeTitle = () => {
    switch (currentMode) {
      case 'scientific':
        return isFa ? 'ماشین حساب پیشرفته' : 'Scientific Calculator';
      case 'converter':
        return isFa ? 'تبدیل واحدها' : 'Unit Converter';
      case 'time':
        return isFa ? 'ماشین حساب ساعت و زمان' : 'Time Calculator';
      case 'finance':
        return isFa ? 'محاسبه تخفیف و مالیات' : 'Discount & Tax';
      case 'date':
        return isFa ? 'محاسبه سن و تاریخ' : 'Date & Age';
      case 'standard':
      default:
        return isFa ? 'ماشین حساب' : 'Calculator';
    }
  };

  const isCalculatorMode = currentMode === 'standard' || currentMode === 'scientific';

  return (
    <div className={`w-full px-4 py-2.5 flex items-center justify-between border-b transition-colors select-none z-10 ${
      isDarkMode ? 'bg-black border-[#2c2c2e] text-white' : 'bg-[#faf9f5] border-slate-200 text-slate-900'
    }`}>
      {/* Left: Drawer trigger and Back */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenDrawer}
          className={`p-2 rounded-2xl transition-all ios-btn ${
            isDarkMode ? 'hover:bg-[#1c1c1e] text-slate-300' : 'hover:bg-[#e5e5ea] text-slate-700'
          }`}
          title={isFa ? 'منوی ابزارها' : 'Menu'}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {!isCalculatorMode && (
          <button
            onClick={() => onSelectMode('standard')}
            className="flex items-center gap-1 text-xs text-blue-500 font-bold px-2.5 py-1 rounded-xl hover:bg-blue-500/10 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isFa ? 'ماشین حساب' : 'Calc'}</span>
          </button>
        )}

        <div className="font-extrabold text-sm md:text-base">
          {getModeTitle()}
        </div>
      </div>

      {/* Right: Mode Toggle + Dark Mode + History + Settings */}
      <div className="flex items-center gap-1">
        {/* Quick Scientific / Standard toggle */}
        {isCalculatorMode && (
          <button
            onClick={() => onSelectMode(currentMode === 'standard' ? 'scientific' : 'standard')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ios-btn ${
              currentMode === 'scientific'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDarkMode
                ? 'bg-[#1c1c1e] text-slate-300 hover:bg-[#2c2c2e]'
                : 'bg-[#e5e5ea] text-slate-700 hover:bg-[#d1d1d6]'
            }`}
            title={currentMode === 'standard' ? 'حالت پیشرفته مهندسی' : 'حالت استاندارد'}
          >
            {currentMode === 'standard' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>{isFa ? 'پیشرفته' : 'Sci'}</span>
              </>
            ) : (
              <>
                <Calculator className="w-3.5 h-3.5" />
                <span>{isFa ? 'ساده' : 'Basic'}</span>
              </>
            )}
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded-2xl transition-all ios-btn ${
            isDarkMode ? 'hover:bg-[#1c1c1e] text-amber-400' : 'hover:bg-[#e5e5ea] text-slate-600'
          }`}
          title={isDarkMode ? 'حالت روز (سفید شیری)' : 'حالت شب (دارک مود)'}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* History button */}
        <button
          onClick={onOpenHistory}
          className={`relative p-2 rounded-2xl transition-all ios-btn ${
            isDarkMode ? 'hover:bg-[#1c1c1e] text-slate-300' : 'hover:bg-[#e5e5ea] text-slate-700'
          }`}
          title={isFa ? 'تاریخچه' : 'History'}
          aria-label="History"
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
              {historyCount > 9 ? '+9' : historyCount}
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-2xl transition-all ios-btn ${
            isDarkMode ? 'hover:bg-[#1c1c1e] text-slate-300' : 'hover:bg-[#e5e5ea] text-slate-700'
          }`}
          title={isFa ? 'تنظیمات' : 'Settings'}
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
