import React from 'react';
import { X, Trash2, ArrowDownToLine, Copy } from 'lucide-react';
import { HistoryItem } from '../types';
import { toPersianDigits, formatWithCommas } from '../utils/calculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectCalculation: (item: HistoryItem) => void;
  onClearHistory: () => void;
  persianDigits: boolean;
  isDarkMode: boolean;
  language: 'fa' | 'en';
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectCalculation,
  onClearHistory,
  persianDigits,
  isDarkMode,
  language,
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return persianDigits ? toPersianDigits(timeStr) : timeStr;
  };

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
      {/* Tap backdrop to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-up Bottom Sheet */}
      <div className={`w-full max-h-[82%] border-t rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp ${
        isDarkMode ? 'bg-[#1c1c1e] text-white border-[#2c2c2e]' : 'bg-[#faf9f5] text-slate-900 border-slate-200'
      }`}>
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-400/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/40">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold">
              {language === 'fa' ? 'تاریخچه محاسبات' : 'Calculation History'}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-bold font-mono-numbers">
              {persianDigits ? toPersianDigits(history.length) : history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 p-1.5 rounded-xl transition-colors"
                title={language === 'fa' ? 'پاک کردن کل تاریخچه' : 'Clear all'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'پاکسازی' : 'Clear'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${
                isDarkMode ? 'bg-[#2c2c2e] hover:bg-[#3a3a3c]' : 'bg-slate-200/60 hover:bg-slate-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of History Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center opacity-50 text-center gap-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isDarkMode ? 'bg-[#2c2c2e]' : 'bg-slate-200'
              }`}>
                <ArrowDownToLine className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-sm font-bold">
                {language === 'fa' ? 'هنوز محاسبه‌ای ثبت نشده است' : 'No calculations yet'}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectCalculation(item);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer active:scale-[0.99] transition-all group relative overflow-hidden shadow-sm ${
                  isDarkMode
                    ? 'bg-[#2c2c2e] border-[#3a3a3c] hover:border-blue-500'
                    : 'bg-white border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs opacity-60 mb-1">
                  <span className="font-mono-numbers">{formatDate(item.timestamp)}</span>
                  <button
                    onClick={(e) => handleCopy(item.result, e)}
                    className="p-1 rounded text-blue-500 hover:bg-blue-500/10 transition-colors"
                    title="کپی نتیجه"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-sm font-mono-numbers text-right dir-ltr truncate opacity-80">
                  {persianDigits ? toPersianDigits(item.expression) : item.expression}
                </div>

                <div className="text-xl font-bold font-mono-numbers text-right dir-ltr mt-0.5 text-blue-500">
                  = {formatWithCommas(item.result, persianDigits)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
