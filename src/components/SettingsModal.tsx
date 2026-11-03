import React from 'react';
import { X, Volume2, Smartphone, Globe, Vibrate, Moon, Sun, Percent, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const isFa = settings.language === 'fa';
  const isDark = settings.isDarkMode;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
      <div className="flex-1" onClick={onClose} />

      <div className={`w-full max-h-[88%] border-t rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp ${
        isDark ? 'bg-[#1c1c1e] text-white border-[#2c2c2e]' : 'bg-[#faf9f5] text-slate-900 border-slate-200'
      }`}>
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-400/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/40">
          <h2 className="text-base font-extrabold">
            {isFa ? 'تنظیمات ماشین حساب' : 'Settings'}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'bg-[#2c2c2e] hover:bg-[#3a3a3c]' : 'bg-slate-200/60 hover:bg-slate-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Section 1: Dark Mode Toggle */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-[#2c2c2e] border-[#3a3a3c]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-800 text-white'
              }`}>
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-extrabold">
                  {isFa ? 'حالت شب / دارک مود (Dark Mode)' : 'Dark Mode'}
                </div>
                <div className="text-[11px] opacity-60">
                  {isFa ? 'سوییچ بین سفید شیری و مشکی آیفون' : 'Switch between milky white and deep dark'}
                </div>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ isDarkMode: !settings.isDarkMode })}
              className={`w-13 h-7 rounded-full p-1 transition-colors flex items-center ${
                settings.isDarkMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Section 2: Default Tax Rate */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-[#2c2c2e] border-[#3a3a3c]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold">
                  {isFa ? 'درصد مالیات پیش‌فرض (VAT)' : 'Default Tax Rate (%)'}
                </div>
                <div className="text-[11px] opacity-60">
                  {isFa ? 'در بخش تخفیف و مالیات اعمال می‌شود' : 'Applied in discount calculations'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.defaultTaxPercent ?? 10}
                onChange={(e) => onUpdateSettings({ defaultTaxPercent: Math.max(0, Number(e.target.value)) })}
                className={`w-16 text-base font-black font-mono-numbers px-2 py-1 rounded-xl outline-none text-center ${
                  isDark ? 'bg-black text-white border border-[#3a3a3c]' : 'bg-slate-100 text-slate-900 border border-slate-300'
                }`}
              />
              <span className="text-sm font-bold text-blue-500">%</span>
            </div>
          </div>

          {/* Section 3: Accent Color (iOS Blue vs iOS Orange) */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#2c2c2e] border-[#3a3a3c]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="text-xs font-extrabold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{isFa ? 'رنگ عملگرها (سبک آیفون)' : 'Operator Accent Color'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ accentColor: 'blue' })}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  settings.accentColor === 'blue'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500 ring-1 ring-blue-500'
                    : isDark ? 'border-[#3a3a3c] text-slate-300' : 'border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-[#007aff]" />
                <span>{isFa ? 'آبی اپل (iOS Blue)' : 'iOS Blue'}</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ accentColor: 'orange' })}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  settings.accentColor === 'orange'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500 ring-1 ring-amber-500'
                    : isDark ? 'border-[#3a3a3c] text-slate-300' : 'border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-[#ff9f0a]" />
                <span>{isFa ? 'نارنجی اپل (iOS Orange)' : 'iOS Orange'}</span>
              </button>
            </div>
          </div>

          {/* Section 4: General Preferences */}
          <div className={`p-4 rounded-2xl border divide-y ${
            isDark ? 'bg-[#2c2c2e] border-[#3a3a3c] divide-[#3a3a3c]' : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
          }`}>
            {/* Sound Feedback */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold">{isFa ? 'صدای کلیک طبیعی' : 'Click Sound'}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Haptic */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold">{isFa ? 'ویبره لمسی (Haptic)' : 'Haptic Vibration'}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticEnabled}
                onChange={(e) => onUpdateSettings({ hapticEnabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Persian Digits Toggle */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold">{isFa ? 'نمایش ارقام فارسی' : 'Persian Digits'}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.persianDigits}
                onChange={(e) => onUpdateSettings({ persianDigits: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Phone Frame Toggle */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold">{isFa ? 'قاب گوشی هوشمند' : 'Phone Frame'}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.phoneFrame}
                onChange={(e) => onUpdateSettings({ phoneFrame: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
