import React, { useState, useMemo } from 'react';
import { Calendar, Cake, Clock } from 'lucide-react';
import { toPersianDigits, formatWithCommas } from '../utils/calculator';

interface DateCalculatorProps {
  isDarkMode: boolean;
  persianDigits: boolean;
  language: 'fa' | 'en';
}

export const DateCalculator: React.FC<DateCalculatorProps> = ({
  isDarkMode,
  persianDigits,
  language,
}) => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');

  const ageData = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime()) || birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;

    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      daysToNextBday,
    };
  }, [birthDate]);

  const fmt = (v: number | string) => formatWithCommas(v.toString(), persianDigits);

  return (
    <div className={`flex-1 flex flex-col p-4 gap-3 overflow-y-auto no-scrollbar select-none ${
      isDarkMode ? 'bg-black text-white' : 'bg-[#faf9f5] text-slate-900'
    }`}>
      {/* Date Input Card */}
      <div className={`p-4 rounded-2xl border ${
        isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <label className="text-xs font-bold block mb-1.5 flex items-center gap-1.5 opacity-80">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>{language === 'fa' ? 'تاریخ تولد یا تاریخ مبدأ' : 'Date of Birth'}</span>
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`w-full text-base font-bold font-mono-numbers px-3 py-2.5 rounded-xl outline-none ${
            isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
          }`}
        />
      </div>

      {ageData && (
        <div className="space-y-3">
          {/* Main Age Card */}
          <div className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-[#1c1c1e] border-blue-500/30' : 'bg-white border-blue-200 shadow-md'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 mb-2">
              <Cake className="w-4 h-4" />
              <span>{language === 'fa' ? 'سن دقیق شما' : 'Your Exact Age'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div className={`p-3 rounded-2xl ${
                isDarkMode ? 'bg-[#2c2c2e]' : 'bg-blue-50 border border-blue-100'
              }`}>
                <span className="text-2xl md:text-3xl font-black text-blue-500 font-mono-numbers block">
                  {fmt(ageData.years)}
                </span>
                <span className="text-xs font-bold opacity-70">
                  {language === 'fa' ? 'سال' : 'Years'}
                </span>
              </div>

              <div className={`p-3 rounded-2xl ${
                isDarkMode ? 'bg-[#2c2c2e]' : 'bg-slate-100 border border-slate-200'
              }`}>
                <span className="text-2xl md:text-3xl font-black font-mono-numbers block">
                  {fmt(ageData.months)}
                </span>
                <span className="text-xs font-bold opacity-70">
                  {language === 'fa' ? 'ماه' : 'Months'}
                </span>
              </div>

              <div className={`p-3 rounded-2xl ${
                isDarkMode ? 'bg-[#2c2c2e]' : 'bg-slate-100 border border-slate-200'
              }`}>
                <span className="text-2xl md:text-3xl font-black font-mono-numbers block">
                  {fmt(ageData.days)}
                </span>
                <span className="text-xs font-bold opacity-70">
                  {language === 'fa' ? 'روز' : 'Days'}
                </span>
              </div>
            </div>

            {/* Next Birthday */}
            <div className="mt-3 pt-3 border-t border-slate-200/30 flex items-center justify-between text-xs">
              <span className="opacity-70 font-semibold">
                {language === 'fa' ? 'تا زادروز بعدی:' : 'Days until next birthday:'}
              </span>
              <span className="text-blue-500 font-black font-mono-numbers text-sm">
                {fmt(ageData.daysToNextBday)} {language === 'fa' ? 'روز دیگر' : 'days left'}
              </span>
            </div>
          </div>

          {/* Life Statistics Card */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${
            isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-bold opacity-80">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{language === 'fa' ? 'آمار روزهای زندگی' : 'Time Elapsed Statistics'}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/20">
              <span className="opacity-70">
                {language === 'fa' ? 'مجموع روزهای زندگی:' : 'Total Days Lived:'}
              </span>
              <span className="font-bold font-mono-numbers">
                {fmt(ageData.totalDays)} {language === 'fa' ? 'روز' : 'days'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="opacity-70">
                {language === 'fa' ? 'مجموع ساعات تقریبی:' : 'Total Approximate Hours:'}
              </span>
              <span className="text-blue-500 font-bold font-mono-numbers">
                {fmt(ageData.totalHours)} {language === 'fa' ? 'ساعت' : 'hours'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
