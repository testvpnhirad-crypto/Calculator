import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowLeft,
  ChevronRight,
  Ruler, 
  Scale, 
  Thermometer, 
  DollarSign, 
  HardDrive, 
  Gauge, 
  Maximize2,
  Clock,
  Box,
  Fuel,
  Compass
} from 'lucide-react';
import { UnitCategory, AppSettings } from '../types';
import { toPersianDigits, toEnglishDigits } from '../utils/calculator';
import { playTactileSound, triggerHaptic } from '../utils/audio';

interface UnitConverterProps {
  isDarkMode: boolean;
  accentColor: 'blue' | 'orange';
  persianDigits: boolean;
  language: 'fa' | 'en';
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

interface UnitInfo {
  id: string;
  nameFa: string;
  nameEn: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export const ALL_UNIT_CATEGORIES: {
  id: UnitCategory;
  nameFa: string;
  nameEn: string;
  descFa: string;
  descEn: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  units: UnitInfo[];
}[] = [
  {
    id: 'length',
    nameFa: 'طول و مسافت',
    nameEn: 'Length & Distance',
    descFa: 'متر، کیلومتر، فوت، مایل، اینچ...',
    descEn: 'Meters, km, feet, miles, inches',
    icon: Ruler,
    color: 'bg-blue-500',
    units: [
      { id: 'm', nameFa: 'متر', nameEn: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', nameFa: 'کیلومتر', nameEn: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', nameFa: 'سانتی‌متر', nameEn: 'Centimeter', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
      { id: 'mm', nameFa: 'میلی‌متر', nameEn: 'Millimeter', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      { id: 'mi', nameFa: 'مایل', nameEn: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'ft', nameFa: 'فوت', nameEn: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', nameFa: 'اینچ', nameEn: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'yd', nameFa: 'یارد', nameEn: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    ],
  },
  {
    id: 'weight',
    nameFa: 'وزن و جرم',
    nameEn: 'Mass & Weight',
    descFa: 'کیلوگرم، گرم، پوند، اونس، تن...',
    descEn: 'Kilograms, grams, pounds, ounces',
    icon: Scale,
    color: 'bg-emerald-500',
    units: [
      { id: 'kg', nameFa: 'کیلوگرم', nameEn: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', nameFa: 'گرم', nameEn: 'Gram', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (v) => v * 1000 },
      { id: 'mg', nameFa: 'میلی‌گرم', nameEn: 'Milligram', symbol: 'mg', toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      { id: 'lb', nameFa: 'پوند', nameEn: 'Pound', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', nameFa: 'اونس', nameEn: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: 'ton', nameFa: 'تن متریک', nameEn: 'Metric Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    id: 'temperature',
    nameFa: 'دما و حرارت',
    nameEn: 'Temperature',
    descFa: 'سلسیوس (°C)، فارنهایت (°F)، کلوین',
    descEn: 'Celsius, Fahrenheit, Kelvin',
    icon: Thermometer,
    color: 'bg-rose-500',
    units: [
      { id: 'c', nameFa: 'سلسیوس', nameEn: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', nameFa: 'فارنهایت', nameEn: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', nameFa: 'کلوین', nameEn: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'currency',
    nameFa: 'ارز و پول',
    nameEn: 'Currency Rates',
    descFa: 'دلار، یورو، تومان، پوند، درهم...',
    descEn: 'USD, EUR, Toman, GBP, AED, TRY',
    icon: DollarSign,
    color: 'bg-amber-500',
    units: [
      { id: 'usd', nameFa: 'دلار آمریکا (USD)', nameEn: 'US Dollar', symbol: '$', toBase: (v) => v, fromBase: (v) => v },
      { id: 'toman', nameFa: 'تومان ایران (TOMAN)', nameEn: 'Iranian Toman', symbol: 'تومان', toBase: (v) => v / 92000, fromBase: (v) => v * 92000 },
      { id: 'eur', nameFa: 'یورو (EUR)', nameEn: 'Euro', symbol: '€', toBase: (v) => v * 1.08, fromBase: (v) => v / 1.08 },
      { id: 'gbp', nameFa: 'پوند انگلیس (GBP)', nameEn: 'British Pound', symbol: '£', toBase: (v) => v * 1.28, fromBase: (v) => v / 1.28 },
      { id: 'aed', nameFa: 'درهم امارات (AED)', nameEn: 'UAE Dirham', symbol: 'د.إ', toBase: (v) => v / 3.67, fromBase: (v) => v * 3.67 },
      { id: 'try', nameFa: 'لیر ترکیه (TRY)', nameEn: 'Turkish Lira', symbol: '₺', toBase: (v) => v / 36.5, fromBase: (v) => v * 36.5 },
      { id: 'cny', nameFa: 'یوان چین (CNY)', nameEn: 'Chinese Yuan', symbol: '¥', toBase: (v) => v / 7.25, fromBase: (v) => v * 7.25 },
    ],
  },
  {
    id: 'storage',
    nameFa: 'حافظه دیجیتال',
    nameEn: 'Digital Storage',
    descFa: 'مگابایت، گیگابایت، ترابایت...',
    descEn: 'MB, GB, TB, KB, Bytes',
    icon: HardDrive,
    color: 'bg-purple-500',
    units: [
      { id: 'mb', nameFa: 'مگابایت (MB)', nameEn: 'Megabyte', symbol: 'MB', toBase: (v) => v, fromBase: (v) => v },
      { id: 'gb', nameFa: 'گیگابایت (GB)', nameEn: 'Gigabyte', symbol: 'GB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'tb', nameFa: 'ترابایت (TB)', nameEn: 'Terabyte', symbol: 'TB', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      { id: 'kb', nameFa: 'کیلوبایت (KB)', nameEn: 'Kilobyte', symbol: 'KB', toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
      { id: 'b', nameFa: 'بایت (Byte)', nameEn: 'Byte', symbol: 'B', toBase: (v) => v / (1024 * 1024), fromBase: (v) => v * 1024 * 1024 },
    ],
  },
  {
    id: 'time',
    nameFa: 'واحدهای زمان',
    nameEn: 'Time Units',
    descFa: 'ثانیه، دقیقه، ساعت، روز، هفته...',
    descEn: 'Seconds, minutes, hours, days, weeks',
    icon: Clock,
    color: 'bg-cyan-500',
    units: [
      { id: 'sec', nameFa: 'ثانیه', nameEn: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      { id: 'min', nameFa: 'دقیقه', nameEn: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: 'hr', nameFa: 'ساعت', nameEn: 'Hour', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'day', nameFa: 'روز', nameEn: 'Day', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: 'wk', nameFa: 'هفته', nameEn: 'Week', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      { id: 'yr', nameFa: 'سال', nameEn: 'Year', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
    ],
  },
  {
    id: 'speed',
    nameFa: 'سرعت',
    nameEn: 'Speed',
    descFa: 'کیلومتر/ساعت، مایل/ساعت، متر/ثانیه',
    descEn: 'km/h, mph, m/s, knots',
    icon: Gauge,
    color: 'bg-indigo-500',
    units: [
      { id: 'kmh', nameFa: 'کیلومتر/ساعت', nameEn: 'km/h', symbol: 'km/h', toBase: (v) => v, fromBase: (v) => v },
      { id: 'mph', nameFa: 'مایل/ساعت', nameEn: 'mph', symbol: 'mph', toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
      { id: 'ms', nameFa: 'متر/ثانیه', nameEn: 'm/s', symbol: 'm/s', toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
      { id: 'knot', nameFa: 'گره دریایی', nameEn: 'Knot', symbol: 'kn', toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
    ],
  },
  {
    id: 'area',
    nameFa: 'مساحت',
    nameEn: 'Area',
    descFa: 'متر مربع، هکتار، جریب، کیلومتر مربع',
    descEn: 'Square meter, hectare, acre, sq ft',
    icon: Maximize2,
    color: 'bg-teal-500',
    units: [
      { id: 'sqm', nameFa: 'متر مربع', nameEn: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { id: 'hectare', nameFa: 'هکتار', nameEn: 'Hectare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { id: 'sqkm', nameFa: 'کیلومتر مربع', nameEn: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'sqft', nameFa: 'فوت مربع', nameEn: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'acre', nameFa: 'جریب / اکر', nameEn: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    ],
  },
  {
    id: 'volume',
    nameFa: 'حجم و مایعات',
    nameEn: 'Volume',
    descFa: 'لیتر، میلی‌لیتر، گالن، متر مکعب',
    descEn: 'Liters, milliliters, gallons, cubic meters',
    icon: Box,
    color: 'bg-orange-500',
    units: [
      { id: 'l', nameFa: 'لیتر', nameEn: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', nameFa: 'میلی‌لیتر', nameEn: 'Milliliter', symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (v) => v * 1000 },
      { id: 'gal', nameFa: 'گالن آمریکایی', nameEn: 'US Gallon', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { id: 'cbm', nameFa: 'متر مکعب', nameEn: 'Cubic Meter', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    id: 'fuel',
    nameFa: 'مصرف سوخت',
    nameEn: 'Fuel Economy',
    descFa: 'لیتر در ۱۰۰ کیلومتر، MPG',
    descEn: 'L/100km, MPG (US)',
    icon: Fuel,
    color: 'bg-red-500',
    units: [
      { id: 'l100km', nameFa: 'لیتر در ۱۰۰ کیلومتر', nameEn: 'L/100km', symbol: 'L/100km', toBase: (v) => v, fromBase: (v) => v },
      { id: 'mpg_us', nameFa: 'مایل بر گالن (US)', nameEn: 'Miles per Gallon', symbol: 'MPG', toBase: (v) => (v > 0 ? 235.215 / v : 0), fromBase: (v) => (v > 0 ? 235.215 / v : 0) },
    ],
  },
  {
    id: 'pressure',
    nameFa: 'فشار',
    nameEn: 'Pressure',
    descFa: 'بار (Bar)، پاسکال (Pa)، PSI، اتمسفر',
    descEn: 'Bar, Pascal, PSI, Atmosphere',
    icon: Compass,
    color: 'bg-sky-500',
    units: [
      { id: 'bar', nameFa: 'بار', nameEn: 'Bar', symbol: 'bar', toBase: (v) => v, fromBase: (v) => v },
      { id: 'pa', nameFa: 'پاسکال', nameEn: 'Pascal', symbol: 'Pa', toBase: (v) => v * 1e-5, fromBase: (v) => v * 1e5 },
      { id: 'psi', nameFa: 'پوند بر اینچ (PSI)', nameEn: 'PSI', symbol: 'psi', toBase: (v) => v * 0.0689476, fromBase: (v) => v / 0.0689476 },
      { id: 'atm', nameFa: 'اتمسفر استاندارد', nameEn: 'Atmosphere', symbol: 'atm', toBase: (v) => v * 1.01325, fromBase: (v) => v / 1.01325 },
    ],
  },
];

export const UnitConverter: React.FC<UnitConverterProps> = ({
  isDarkMode,
  accentColor,
  persianDigits,
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  const isFa = language === 'fa';
  
  // Navigation State: 'menu' (Grid of cards) vs 'calc' (Conversion Calculator)
  const [viewState, setViewState] = useState<'menu' | 'calc'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>('length');

  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('km');
  const [inputValue, setInputValue] = useState<string>('100');

  const category = useMemo(() => {
    return ALL_UNIT_CATEGORIES.find((c) => c.id === selectedCategory) || ALL_UNIT_CATEGORIES[0];
  }, [selectedCategory]);

  const fromUnit = useMemo(() => {
    return category.units.find((u) => u.id === fromUnitId) || category.units[0];
  }, [category, fromUnitId]);

  const toUnit = useMemo(() => {
    return category.units.find((u) => u.id === toUnitId) || category.units[1] || category.units[0];
  }, [category, toUnitId]);

  const handlePickCategory = (catId: UnitCategory) => {
    playTactileSound('switch', soundEnabled);
    triggerHaptic(12, hapticEnabled);
    setSelectedCategory(catId);
    const cat = ALL_UNIT_CATEGORIES.find((c) => c.id === catId)!;
    setFromUnitId(cat.units[0].id);
    setToUnitId(cat.units[1] ? cat.units[1].id : cat.units[0].id);
    setViewState('calc');
  };

  const convertedValue = useMemo(() => {
    const rawNum = parseFloat(toEnglishDigits(inputValue));
    if (isNaN(rawNum)) return '0';
    const inBase = fromUnit.toBase(rawNum);
    const converted = toUnit.fromBase(inBase);
    
    if (Math.abs(converted) >= 1e9 || (Math.abs(converted) < 1e-4 && converted !== 0)) {
      return converted.toExponential(4);
    }
    return Number(converted.toFixed(6)).toString();
  }, [inputValue, fromUnit, toUnit]);

  const handleSwap = () => {
    playTactileSound('op', soundEnabled);
    triggerHaptic(15, hapticEnabled);
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleKeypadTap = (char: string) => {
    playTactileSound('num', soundEnabled);
    triggerHaptic(10, hapticEnabled);
    if (char === 'C') {
      setInputValue('0');
    } else if (char === 'DEL') {
      setInputValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (char === '.') {
      if (!inputValue.includes('.')) {
        setInputValue((prev) => prev + '.');
      }
    } else {
      setInputValue((prev) => (prev === '0' ? char : prev + char));
    }
  };

  const fmt = (numStr: string) => (persianDigits ? toPersianDigits(numStr) : numStr);
  const primaryAccent = accentColor === 'orange' ? 'bg-[#ff9f0a] text-white' : 'bg-[#007aff] text-white';

  // 1. SCREEN 1: CATEGORY SELECTION DASHBOARD
  if (viewState === 'menu') {
    return (
      <div className={`flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar select-none ${
        isDarkMode ? 'bg-black text-white' : 'bg-[#faf9f5] text-slate-900'
      }`}>
        <div className="mb-4">
          <h2 className="text-lg font-black tracking-tight">
            {isFa ? 'انتخاب دسته‌بندی تبدیل واحد' : 'Choose Unit Category'}
          </h2>
          <p className="text-xs opacity-60 mt-0.5">
            {isFa ? 'برای شروع تبدیل، واحد مورد نظر خود را انتخاب کنید:' : 'Select any category to open converter:'}
          </p>
        </div>

        {/* Responsive Grid of Category Cards */}
        <div className="grid grid-cols-2 gap-2.5 pb-4">
          {ALL_UNIT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handlePickCategory(cat.id)}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between h-28 ios-btn ${
                  isDarkMode
                    ? 'bg-[#1c1c1e] border-[#2c2c2e] hover:border-slate-700'
                    : 'bg-white border-slate-200/80 shadow-sm hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-xl ${cat.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40 -rotate-180" />
                </div>

                <div>
                  <div className="font-extrabold text-xs">
                    {isFa ? cat.nameFa : cat.nameEn}
                  </div>
                  <div className="text-[10px] opacity-60 truncate mt-0.5">
                    {isFa ? cat.descFa : cat.descEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. SCREEN 2: DEDICATED CONVERSION CALCULATOR
  return (
    <div className={`flex-1 flex flex-col p-4 gap-3 overflow-y-auto no-scrollbar select-none justify-between ${
      isDarkMode ? 'bg-black text-white' : 'bg-[#faf9f5] text-slate-900'
    }`}>
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={() => {
            playTactileSound('switch', soundEnabled);
            setViewState('menu');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isDarkMode ? 'bg-[#1c1c1e] text-blue-400' : 'bg-white text-blue-600 shadow-sm border border-slate-200'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isFa ? 'بازگشت به دسته‌بندی‌ها' : 'All Categories'}</span>
        </button>

        <span className="text-xs font-bold opacity-80">
          {isFa ? category.nameFa : category.nameEn}
        </span>
      </div>

      {/* From Card */}
      <div className={`p-4 rounded-2xl border ${
        isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs opacity-60 font-bold">
            {isFa ? 'از واحد' : 'From'}
          </span>
          <select
            value={fromUnit.id}
            onChange={(e) => setFromUnitId(e.target.value)}
            className={`text-xs font-bold rounded-lg px-2 py-1 outline-none ${
              isDarkMode ? 'bg-[#2c2c2e] text-white border border-[#3a3a3c]' : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {isFa ? u.nameFa : u.nameEn} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl md:text-3xl font-black font-mono-numbers truncate dir-ltr">
            {fmt(inputValue)}
          </span>
          <span className="text-sm font-bold text-blue-500 shrink-0">
            {fromUnit.symbol}
          </span>
        </div>
      </div>

      {/* Swap Button Divider */}
      <div className="flex items-center justify-center -my-1 z-10">
        <button
          onClick={handleSwap}
          className={`p-2.5 rounded-full ${primaryAccent} shadow-md hover:scale-105 active:scale-95 transition-all`}
          title="جابجایی واحدها"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* To Card (Result) */}
      <div className={`p-4 rounded-2xl border-2 ${
        isDarkMode ? 'bg-[#1c1c1e] border-blue-500/40' : 'bg-white border-blue-500/30 shadow-md'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-blue-500 font-bold">
            {isFa ? 'به واحد (نتیجه)' : 'To (Result)'}
          </span>
          <select
            value={toUnit.id}
            onChange={(e) => setToUnitId(e.target.value)}
            className={`text-xs font-bold rounded-lg px-2 py-1 outline-none ${
              isDarkMode ? 'bg-[#2c2c2e] text-white border border-[#3a3a3c]' : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {isFa ? u.nameFa : u.nameEn} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl md:text-3xl font-black font-mono-numbers text-blue-600 truncate dir-ltr">
            {fmt(convertedValue)}
          </span>
          <span className="text-sm font-bold text-blue-500 shrink-0">
            {toUnit.symbol}
          </span>
        </div>
      </div>

      {/* Converter Quick Numeric Keypad */}
      <div className="grid grid-cols-4 gap-1.5 mt-auto pt-2 dir-ltr">
        {['7', '8', '9', 'C', '4', '5', '6', 'DEL', '1', '2', '3', '0', '00', '.'].map((key) => {
          const isAction = key === 'C' || key === 'DEL';
          return (
            <button
              key={key}
              onClick={() => handleKeypadTap(key)}
              className={`h-11 rounded-xl text-base font-bold font-mono-numbers transition-all ios-btn ${
                isAction
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : isDarkMode
                  ? 'bg-[#2c2c2e] text-white hover:bg-[#3a3a3c]'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {key === 'DEL' ? '⌫' : key === 'C' ? 'C' : fmt(key)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
