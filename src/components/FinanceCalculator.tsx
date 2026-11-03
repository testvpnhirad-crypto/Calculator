import React, { useState, useEffect } from 'react';
import { Receipt, Settings as SettingsIcon } from 'lucide-react';
import { toPersianDigits, formatWithCommas } from '../utils/calculator';

interface FinanceCalculatorProps {
  isDarkMode: boolean;
  accentColor: 'blue' | 'orange';
  persianDigits: boolean;
  language: 'fa' | 'en';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  defaultTaxPercent: number;
  onOpenSettings: () => void;
}

export const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({
  isDarkMode,
  accentColor,
  persianDigits,
  language,
  defaultTaxPercent,
  onOpenSettings,
}) => {
  const isFa = language === 'fa';

  // Input states (Top of page)
  const [originalPrice, setOriginalPrice] = useState<number>(100000);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(defaultTaxPercent || 10);

  // Sync tax percent with default setting if changed
  useEffect(() => {
    setTaxPercent(defaultTaxPercent || 10);
  }, [defaultTaxPercent]);

  // Calculations
  const discountAmount = (originalPrice * discountPercent) / 100;
  const priceAfterDiscount = Math.max(0, originalPrice - discountAmount);
  const taxAmount = (priceAfterDiscount * taxPercent) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;

  const fmt = (v: number | string) => formatWithCommas(v.toString(), persianDigits);

  return (
    <div className={`flex-1 flex flex-col p-4 gap-4 overflow-y-auto no-scrollbar select-none justify-between ${
      isDarkMode ? 'bg-black text-white' : 'bg-[#faf9f5] text-slate-900'
    }`}>
      {/* ============================================================== */}
      {/* 1. TOP SECTION: DATA ENTRY                                     */}
      {/* ============================================================== */}
      <div className="space-y-3.5">
        {/* Title Badge */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="text-base font-black">
              {isFa ? 'محاسبه تخفیف و مالیات' : 'Discount & Tax Calculator'}
            </h3>
            <p className="text-xs opacity-60">
              {isFa ? 'مبالغ و درصدها را وارد کنید' : 'Enter price and percentages'}
            </p>
          </div>
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors ${
              isDarkMode ? 'bg-[#1c1c1e] text-blue-400 border border-[#2c2c2e]' : 'bg-white text-blue-600 border border-slate-200 shadow-sm'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>{isFa ? 'تنظیمات نرخ مالیات' : 'Tax Settings'}</span>
          </button>
        </div>

        {/* Input 1: Original Price */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <label className="text-xs font-bold block mb-1.5 opacity-80">
            {isFa ? 'قیمت اصلی کالا یا خدمت' : 'Original Price'}
          </label>
          <input
            type="number"
            min="0"
            value={originalPrice || ''}
            onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
            className={`w-full text-2xl font-black font-mono-numbers px-3.5 py-2 rounded-xl outline-none ${
              isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
            }`}
            placeholder="0"
          />
        </div>

        {/* Input 2: Discount Percent (Direct Numerical Input Only - default pills removed as requested) */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold opacity-80">
              {isFa ? 'درصد تخفیف' : 'Discount Percentage (%)'}
            </label>
            <span className="text-xs font-bold text-rose-500">
              {isFa ? 'تایپ مستقیم درصد' : 'Direct numeric input'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
              className={`w-full text-2xl font-black font-mono-numbers px-3.5 py-2 rounded-xl outline-none ${
                isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
              }`}
              placeholder="مثلا 15 یا 25.5"
            />
            <span className="text-2xl font-bold opacity-60">%</span>
          </div>
        </div>

        {/* Input 3: Tax Percent (Default 10%, directly editable + setting) */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <label className="text-xs font-bold opacity-80">
                {isFa ? 'درصد مالیات بر ارزش افزوده (VAT)' : 'Tax Rate (VAT %)'}
              </label>
              <span className="text-[11px] opacity-60 block">
                {isFa ? `پیش‌فرض ${defaultTaxPercent}٪ (قابل تنظیم در منوی تنظیمات)` : `Default ${defaultTaxPercent}%`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="100"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
                className={`w-20 text-lg font-black font-mono-numbers px-2.5 py-1.5 rounded-xl outline-none text-center ${
                  isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                }`}
              />
              <span className="text-lg font-bold opacity-60">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. BOTTOM SECTION: FINAL REPORT CARD                           */}
      {/* ============================================================== */}
      <div className={`p-4 rounded-2xl border-2 ${
        isDarkMode ? 'bg-[#1c1c1e] border-blue-500/40' : 'bg-white border-blue-500/30 shadow-lg'
      }`}>
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-200/40 text-xs font-bold">
          <Receipt className="w-4 h-4 text-blue-500" />
          <span>{isFa ? 'گزارش نهایی فاکتور' : 'Calculation Summary'}</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 opacity-75">
            <span>{isFa ? 'قیمت اصلی کالا:' : 'Original Price:'}</span>
            <span className="font-bold font-mono-numbers text-sm">{fmt(originalPrice)}</span>
          </div>

          <div className="flex items-center justify-between py-1 text-rose-500 font-semibold">
            <span>{isFa ? `مبلغ تخفیف (${discountPercent}٪):` : `Discount (${discountPercent}%):`}</span>
            <span className="font-bold font-mono-numbers text-sm">− {fmt(Math.round(discountAmount))}</span>
          </div>

          <div className="flex items-center justify-between py-1 text-blue-500 font-semibold">
            <span>{isFa ? `مبلغ مالیات (${taxPercent}٪):` : `Tax (${taxPercent}%):`}</span>
            <span className="font-bold font-mono-numbers text-sm">+ {fmt(Math.round(taxAmount))}</span>
          </div>

          <div className="mt-3 pt-3 border-t-2 border-slate-200/60 flex items-baseline justify-between">
            <span className="font-black text-sm md:text-base">
              {isFa ? 'مبلغ نهایی قابل پرداخت:' : 'Final Payable Amount:'}
            </span>
            <span className="text-2xl md:text-3xl font-black text-blue-600 font-mono-numbers">
              {fmt(Math.round(finalPrice))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
