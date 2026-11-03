import React from 'react';
import { toPersianDigits } from '../utils/calculator';

interface KeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onScientificFunc: (fn: string) => void;
  onClear: () => void;
  onEquals: () => void;
  onParenthesis: () => void;
  onPercentage: () => void;
  onNegate: () => void;
  onDecimal: () => void;
  // Memory
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
  hasMemory: boolean;
  // State
  persianDigits: boolean;
  isDarkMode: boolean;
  accentColor: 'blue' | 'orange';
  isScientificMode: boolean;
  angleUnit: 'deg' | 'rad';
  onToggleAngleUnit: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onNumber,
  onOperator,
  onScientificFunc,
  onClear,
  onEquals,
  onParenthesis,
  onPercentage,
  onNegate,
  onDecimal,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
  hasMemory,
  persianDigits,
  isDarkMode,
  accentColor,
  isScientificMode,
  angleUnit,
  onToggleAngleUnit,
}) => {
  const fmt = (n: string) => (persianDigits ? toPersianDigits(n) : n);

  // iOS Authentic Color Palette
  const opColor = accentColor === 'orange'
    ? 'bg-[#ff9f0a] hover:bg-[#e08b06] active:bg-[#ffb340] text-white shadow-sm'
    : 'bg-[#007aff] hover:bg-[#0069d9] active:bg-[#409cff] text-white shadow-sm';

  const numBtnClass = isDarkMode
    ? 'bg-[#333333] hover:bg-[#3d3d3d] active:bg-[#737373] text-white'
    : 'bg-white hover:bg-slate-50 active:bg-slate-200 text-slate-900 border border-slate-200 shadow-sm';

  const topUtilBtnClass = isDarkMode
    ? 'bg-[#a5a5a5] hover:bg-[#b5b5b5] active:bg-[#d9d9d9] text-black font-semibold'
    : 'bg-[#e5e5ea] hover:bg-[#d1d1d6] active:bg-[#c7c7cc] text-slate-900 font-semibold';

  const sciBtnClass = isDarkMode
    ? 'bg-[#212124] hover:bg-[#2c2c2e] active:bg-[#3a3a3c] text-slate-200'
    : 'bg-[#f2f2f7] hover:bg-[#e5e5ea] active:bg-[#d1d1d6] text-slate-800 border border-slate-200/60';

  return (
    <div
      dir="ltr"
      className={`w-full flex-1 flex flex-col justify-end p-3 gap-2 select-none overflow-hidden ${
        isDarkMode ? 'bg-black' : 'bg-[#faf9f5]'
      }`}
    >
      {/* Memory Bar in English: MC, MR, M+, M-, MS */}
      <div className="grid grid-cols-5 gap-1.5 px-0.5">
        {[
          { label: 'MC', action: onMemoryClear, disabled: !hasMemory },
          { label: 'MR', action: onMemoryRecall, disabled: !hasMemory },
          { label: 'M+', action: onMemoryAdd, disabled: false },
          { label: 'M-', action: onMemorySubtract, disabled: false },
          { label: 'MS', action: onMemoryStore, disabled: false },
        ].map((m) => (
          <button
            key={m.label}
            onClick={m.action}
            disabled={m.disabled}
            className={`py-1 rounded-xl text-xs font-bold tracking-wider transition-all ios-btn ${
              m.disabled
                ? 'opacity-20 cursor-not-allowed bg-transparent text-slate-400'
                : isDarkMode
                ? 'bg-[#1c1c1e] text-blue-400 hover:text-white border border-[#2c2c2e]'
                : 'bg-white text-blue-600 hover:text-blue-800 border border-slate-200 shadow-sm'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {isScientificMode ? (
        /* ============================================================== */
        /* SCIENTIFIC / ADVANCED: 5 columns x 7 compact rows               */
        /* Rightmost column (col 5) is strictly arithmetic operators!      */
        /* ============================================================== */
        <div className="grid grid-cols-5 gap-1.5 flex-1">
          {/* Row 1: Trig & log */}
          <button onClick={() => onScientificFunc('sin')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>sin</button>
          <button onClick={() => onScientificFunc('cos')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>cos</button>
          <button onClick={() => onScientificFunc('tan')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>tan</button>
          <button onClick={() => onScientificFunc('ln')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>ln</button>
          <button onClick={() => onScientificFunc('log')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>log</button>

          {/* Row 2: Powers, roots, constants */}
          <button onClick={() => onScientificFunc('sqrt')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>√</button>
          <button onClick={() => onScientificFunc('power')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>xʸ</button>
          <button onClick={() => onScientificFunc('square')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>x²</button>
          <button onClick={() => onScientificFunc('pi')} className={`h-10 rounded-2xl text-sm font-bold text-blue-500 ios-btn ${sciBtnClass}`}>π</button>
          <button onClick={() => onScientificFunc('e')} className={`h-10 rounded-2xl text-sm font-bold text-blue-500 ios-btn ${sciBtnClass}`}>e</button>

          {/* Row 3: Clear (C in English), Parens, %, Factorial, DIVIDE on the RIGHT */}
          <button onClick={onClear} className={`h-10 rounded-2xl text-sm font-bold ios-btn ${topUtilBtnClass}`}>C</button>
          <button onClick={onParenthesis} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${topUtilBtnClass}`}>( )</button>
          <button onClick={onPercentage} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${topUtilBtnClass}`}>%</button>
          <button onClick={() => onScientificFunc('factorial')} className={`h-10 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>x!</button>
          {/* Operator: ÷ on RIGHT */}
          <button onClick={() => onOperator('÷')} className={`h-10 rounded-2xl text-xl font-bold ios-btn ${opColor}`}>÷</button>

          {/* Row 4: 7, 8, 9, 1/x, MULTIPLY on the RIGHT */}
          <button onClick={() => onNumber('7')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('7')}</button>
          <button onClick={() => onNumber('8')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('8')}</button>
          <button onClick={() => onNumber('9')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('9')}</button>
          <button onClick={() => onScientificFunc('inverse')} className={`h-11 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>1/x</button>
          {/* Operator: × on RIGHT */}
          <button onClick={() => onOperator('×')} className={`h-11 rounded-2xl text-xl font-bold ios-btn ${opColor}`}>×</button>

          {/* Row 5: 4, 5, 6, |x|, SUBTRACT on the RIGHT */}
          <button onClick={() => onNumber('4')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('4')}</button>
          <button onClick={() => onNumber('5')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('5')}</button>
          <button onClick={() => onNumber('6')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('6')}</button>
          <button onClick={() => onScientificFunc('abs')} className={`h-11 rounded-2xl text-xs font-bold ios-btn ${sciBtnClass}`}>|x|</button>
          {/* Operator: − on RIGHT */}
          <button onClick={() => onOperator('−')} className={`h-11 rounded-2xl text-xl font-bold ios-btn ${opColor}`}>−</button>

          {/* Row 6: 1, 2, 3, ±, ADD on the RIGHT */}
          <button onClick={() => onNumber('1')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('1')}</button>
          <button onClick={() => onNumber('2')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('2')}</button>
          <button onClick={() => onNumber('3')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('3')}</button>
          <button onClick={onNegate} className={`h-11 rounded-2xl text-sm font-bold ios-btn ${topUtilBtnClass}`}>±</button>
          {/* Operator: + on RIGHT */}
          <button onClick={() => onOperator('+')} className={`h-11 rounded-2xl text-xl font-bold ios-btn ${opColor}`}>+</button>

          {/* Row 7: 0, 00, Decimal, DEG/RAD (only in scientific!), EQUALS on the RIGHT */}
          <button onClick={() => onNumber('0')} className={`h-11 rounded-2xl text-lg font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('0')}</button>
          <button onClick={() => onNumber('00')} className={`h-11 rounded-2xl text-sm font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('00')}</button>
          <button onClick={onDecimal} className={`h-11 rounded-2xl text-2xl font-black font-mono-numbers ios-btn ${numBtnClass}`}>.</button>
          <button onClick={onToggleAngleUnit} className={`h-11 rounded-2xl text-xs font-extrabold text-blue-500 ios-btn ${sciBtnClass}`}>
            {angleUnit.toUpperCase()}
          </button>
          {/* Operator: = on RIGHT */}
          <button onClick={onEquals} className={`h-11 rounded-2xl text-2xl font-black ios-btn ${opColor}`}>=</button>
        </div>
      ) : (
        /* ============================================================== */
        /* STANDARD MODE: 4 columns x 5 iconic iPhone rows                */
        /* Rightmost column (col 4) has ÷, ×, −, +, =                     */
        /* ============================================================== */
        <div className="grid grid-cols-4 gap-2.5 flex-1">
          {/* Row 1: C (English), ±, %, DIVIDE (on right) */}
          <button onClick={onClear} className={`h-14 md:h-16 rounded-3xl text-xl font-bold ios-btn ${topUtilBtnClass}`}>C</button>
          <button onClick={onNegate} className={`h-14 md:h-16 rounded-3xl text-xl font-bold ios-btn ${topUtilBtnClass}`}>±</button>
          <button onClick={onPercentage} className={`h-14 md:h-16 rounded-3xl text-xl font-bold ios-btn ${topUtilBtnClass}`}>%</button>
          {/* Operator: ÷ on RIGHT */}
          <button onClick={() => onOperator('÷')} className={`h-14 md:h-16 rounded-3xl text-3xl font-bold ios-btn ${opColor}`}>÷</button>

          {/* Row 2: 7, 8, 9, MULTIPLY (on right) */}
          <button onClick={() => onNumber('7')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('7')}</button>
          <button onClick={() => onNumber('8')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('8')}</button>
          <button onClick={() => onNumber('9')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('9')}</button>
          {/* Operator: × on RIGHT */}
          <button onClick={() => onOperator('×')} className={`h-14 md:h-16 rounded-3xl text-3xl font-bold ios-btn ${opColor}`}>×</button>

          {/* Row 3: 4, 5, 6, SUBTRACT (on right) */}
          <button onClick={() => onNumber('4')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('4')}</button>
          <button onClick={() => onNumber('5')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('5')}</button>
          <button onClick={() => onNumber('6')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('6')}</button>
          {/* Operator: − on RIGHT */}
          <button onClick={() => onOperator('−')} className={`h-14 md:h-16 rounded-3xl text-3xl font-bold ios-btn ${opColor}`}>−</button>

          {/* Row 4: 1, 2, 3, ADD (on right) */}
          <button onClick={() => onNumber('1')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('1')}</button>
          <button onClick={() => onNumber('2')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('2')}</button>
          <button onClick={() => onNumber('3')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('3')}</button>
          {/* Operator: + on RIGHT */}
          <button onClick={() => onOperator('+')} className={`h-14 md:h-16 rounded-3xl text-3xl font-bold ios-btn ${opColor}`}>+</button>

          {/* Row 5: 0 (or 0 + ()), decimal, EQUALS (on right) */}
          <button onClick={onParenthesis} className={`h-14 md:h-16 rounded-3xl text-xl font-bold ios-btn ${topUtilBtnClass}`}>( )</button>
          <button onClick={() => onNumber('0')} className={`h-14 md:h-16 rounded-3xl text-2xl md:text-3xl font-bold font-mono-numbers ios-btn ${numBtnClass}`}>{fmt('0')}</button>
          <button onClick={onDecimal} className={`h-14 md:h-16 rounded-3xl text-3xl font-black font-mono-numbers ios-btn ${numBtnClass}`}>.</button>
          {/* Operator: = on RIGHT */}
          <button onClick={onEquals} className={`h-14 md:h-16 rounded-3xl text-3xl font-black ios-btn ${opColor}`}>=</button>
        </div>
      )}
    </div>
  );
};
