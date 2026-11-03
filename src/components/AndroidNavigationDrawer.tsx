import React from 'react';
import { 
  X, 
  Calculator, 
  Sparkles, 
  ArrowLeftRight, 
  Percent, 
  Calendar, 
  History, 
  Settings,
  ChevronLeft,
  Clock
} from 'lucide-react';
import { CalculatorMode } from '../types';

interface AndroidNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  historyCount: number;
  isDarkMode: boolean;
  language: 'fa' | 'en';
}

export const AndroidNavigationDrawer: React.FC<AndroidNavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  onOpenHistory,
  onOpenSettings,
  historyCount,
  isDarkMode,
  language,
}) => {
  const isFa = language === 'fa';

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'standard' as CalculatorMode,
      titleFa: 'ماشین حساب ساده',
      titleEn: 'Standard Calculator',
      descFa: 'طراحی شیک به سبک آیفون',
      descEn: 'Clean minimalist iOS style',
      icon: Calculator,
    },
    {
      id: 'scientific' as CalculatorMode,
      titleFa: 'ماشین حساب مهندسی (پیشرفته)',
      titleEn: 'Scientific Calculator',
      descFa: 'مثلثات، لگاریتم، توان و ریشه‌ها',
      descEn: 'Trig, logarithms, powers in 1 page',
      icon: Sparkles,
    },
    {
      id: 'time' as CalculatorMode,
      titleFa: 'ماشین حساب ساعت و زمان',
      titleEn: 'Time & Clock Calculator',
      descFa: 'اختلاف زمان، جمع/تفریق ساعت، ساعت کاری',
      descEn: 'Duration, work hours, add/sub times',
      icon: Clock,
    },
    {
      id: 'converter' as CalculatorMode,
      titleFa: 'تبدیل جامع واحدها',
      titleEn: 'Unit Converter Suite',
      descFa: 'صفحه انتخاب اختصاصی با ۱۱ دسته‌بندی',
      descEn: 'Interactive selection menu & live rates',
      icon: ArrowLeftRight,
    },
    {
      id: 'finance' as CalculatorMode,
      titleFa: 'محاسبه تخفیف و مالیات',
      titleEn: 'Discount & Tax Calculator',
      descFa: 'تایپ مستقیم درصد و مالیات ۱۰٪',
      descEn: 'Direct percent typing & 10% VAT',
      icon: Percent,
    },
    {
      id: 'date' as CalculatorMode,
      titleFa: 'محاسبه سن و تاریخ',
      titleEn: 'Date & Age Calculator',
      descFa: 'محاسبه سن دقیق و روزشمار زادروز',
      descEn: 'Exact age and birthday countdown',
      icon: Calendar,
    },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-start animate-fadeIn">
      {/* Tap backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className={`relative w-[295px] max-w-[85%] h-full shadow-2xl flex flex-col z-10 border-l animate-slideRight ${
        isDarkMode ? 'bg-[#1c1c1e] text-white border-[#2c2c2e]' : 'bg-[#faf9f5] text-slate-900 border-slate-200'
      }`}>
        {/* Drawer Header */}
        <div className={`p-5 relative ${
          isDarkMode ? 'bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] text-white' : 'bg-gradient-to-br from-slate-900 to-blue-950 text-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md">
              NC
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-base font-bold tracking-tight">
            {isFa ? 'ماشین حساب نورا' : 'NovaCalc Pro'}
          </h2>
          <p className="text-xs opacity-75 mt-0.5">
            {isFa ? 'منوی ابزارها و محاسبات' : 'Tools & Calculations Menu'}
          </p>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="text-[11px] font-bold opacity-50 px-3 py-1 uppercase tracking-wider">
            {isFa ? 'بخش‌های اصلی' : 'Main Sections'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectMode(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-right ios-btn ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : isDarkMode
                    ? 'hover:bg-[#2c2c2e] text-slate-200'
                    : 'hover:bg-[#e5e5ea] text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : isDarkMode ? 'bg-[#2c2c2e] text-blue-400' : 'bg-white text-blue-600 shadow-sm'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {isFa ? item.titleFa : item.titleEn}
                    </div>
                    <div className={`text-[10px] ${isActive ? 'text-white/80' : 'opacity-60'}`}>
                      {isFa ? item.descFa : item.descEn}
                    </div>
                  </div>
                </div>
                <ChevronLeft className={`w-4 h-4 transition-transform ${isActive ? 'text-white rotate-180' : 'opacity-40'}`} />
              </button>
            );
          })}

          <div className="pt-3 pb-1 border-t border-slate-200/40">
            <div className="text-[11px] font-bold opacity-50 px-3 py-1 uppercase tracking-wider">
              {isFa ? 'ابزارهای برنامه' : 'Utilities'}
            </div>
          </div>

          {/* History */}
          <button
            onClick={() => {
              onClose();
              onOpenHistory();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-right ios-btn ${
              isDarkMode ? 'hover:bg-[#2c2c2e] text-slate-200' : 'hover:bg-[#e5e5ea] text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-[#2c2c2e] text-blue-400' : 'bg-white text-blue-600 shadow-sm'
              }`}>
                <History className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">
                  {isFa ? 'تاریخچه محاسبات' : 'History'}
                </div>
                <div className="text-[10px] opacity-60">
                  {isFa ? 'مشاهده و کپی محاسبات گذشته' : 'Past calculations & tapes'}
                </div>
              </div>
            </div>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-right ios-btn ${
              isDarkMode ? 'hover:bg-[#2c2c2e] text-slate-200' : 'hover:bg-[#e5e5ea] text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-[#2c2c2e] text-blue-400' : 'bg-white text-blue-600 shadow-sm'
              }`}>
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">
                  {isFa ? 'تنظیمات' : 'Settings'}
                </div>
                <div className="text-[10px] opacity-60">
                  {isFa ? 'دارک مود، درصد مالیات، صدا' : 'Dark mode, tax rate, sound'}
                </div>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 opacity-40" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200/40 text-center text-[11px] opacity-50">
          iOS Minimalist Edition
        </div>
      </div>
    </div>
  );
};
