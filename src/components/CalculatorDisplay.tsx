import React, { useRef, useEffect, useState } from 'react';
import { Delete, Copy, Check } from 'lucide-react';
import { formatWithCommas, toPersianDigits } from '../utils/calculator';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  angleUnit: 'deg' | 'rad';
  onToggleAngleUnit: () => void;
  hasMemory: boolean;
  memoryValue: number;
  onBackspace: () => void;
  onClearAll: () => void;
  persianDigits: boolean;
  isDarkMode: boolean;
  isScientificMode: boolean;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  angleUnit,
  onToggleAngleUnit,
  hasMemory,
  memoryValue,
  onBackspace,
  onClearAll,
  persianDigits,
  isDarkMode,
  isScientificMode,
}) => {
  const [copied, setCopied] = useState(false);
  const exprScrollRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (exprScrollRef.current) {
      exprScrollRef.current.scrollLeft = exprScrollRef.current.scrollWidth;
    }
  }, [expression]);

  const handleCopy = () => {
    const textToCopy = result || expression || '0';
    navigator.clipboard.writeText(textToCopy).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      onClearAll();
      if ('vibrate' in navigator) navigator.vibrate(30);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const displayVal = result || '0';
  const valLength = displayVal.length;
  let fontSizeClass = 'text-5xl md:text-6xl';
  if (valLength > 12) fontSizeClass = 'text-2xl md:text-3xl';
  else if (valLength > 9) fontSizeClass = 'text-3xl md:text-4xl';
  else if (valLength > 6) fontSizeClass = 'text-4xl md:text-5xl';

  const formattedResult = formatWithCommas(displayVal, persianDigits);
  const formattedExpr = persianDigits ? toPersianDigits(expression) : expression;

  return (
    <div className={`w-full px-6 py-4 flex flex-col justify-end select-none transition-colors duration-200 ${
      isDarkMode ? 'bg-black text-white' : 'bg-[#faf9f5] text-slate-900'
    } min-h-[150px] md:min-h-[175px]`}>
      {/* Top row indicators: Memory badge and DEG/RAD (ONLY shown in scientific mode!) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {/* Angle Unit: ONLY IN SCIENTIFIC MODE as explicitly requested */}
          {isScientificMode && (
            <button
              onClick={onToggleAngleUnit}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                isDarkMode ? 'bg-[#1c1c1e] text-blue-400' : 'bg-[#e5e5ea] text-blue-600'
              }`}
              title="تغییر واحد زاویه"
            >
              {angleUnit.toUpperCase()}
            </button>
          )}

          {/* Memory Indicator in English */}
          {hasMemory && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                isDarkMode ? 'bg-[#1c1c1e] text-blue-400' : 'bg-[#e5e5ea] text-blue-600'
              }`}
              title={`Memory: ${memoryValue}`}
            >
              <span>M</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            isDarkMode ? 'text-slate-400 hover:text-white hover:bg-[#1c1c1e]' : 'text-slate-500 hover:text-slate-900 hover:bg-[#e5e5ea]'
          }`}
          title="کپی نتیجه"
          aria-label="Copy result"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] text-emerald-500">کپی شد</span>
            </>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expression line */}
      <div
        ref={exprScrollRef}
        className={`w-full overflow-x-auto no-scrollbar text-right text-sm md:text-base font-mono-numbers tracking-wide min-h-[24px] whitespace-nowrap mb-1 dir-ltr opacity-60`}
      >
        {formattedExpr || '\u00A0'}
      </div>

      {/* Main active display */}
      <div className="w-full flex items-baseline justify-between gap-3">
        <div className="flex-1 overflow-x-auto no-scrollbar text-right dir-ltr">
          <span
            className={`font-light md:font-normal tracking-tight font-mono-numbers leading-none inline-block transition-all ${fontSizeClass}`}
          >
            {formattedResult}
          </span>
        </div>

        {/* Backspace Button with long-press support */}
        <button
          onClick={onBackspace}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          className={`p-2 rounded-2xl transition-all shrink-0 active:scale-90 ${
            isDarkMode ? 'text-slate-400 hover:text-white hover:bg-[#1c1c1e]' : 'text-slate-500 hover:text-slate-900 hover:bg-[#e5e5ea]'
          }`}
          title="حذف آخرین رقم"
          aria-label="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
