import React, { useState } from 'react';
import { Clock, Plus, Minus, ArrowRightLeft, Briefcase, RotateCcw } from 'lucide-react';
import { playTactileSound, triggerHaptic } from '../utils/audio';

interface TimeCalculatorProps {
  isDarkMode: boolean;
  accentColor: 'blue' | 'orange';
  language: 'fa' | 'en';
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const TimeCalculator: React.FC<TimeCalculatorProps> = ({
  isDarkMode,
  accentColor,
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  const isFa = language === 'fa';
  const [tab, setTab] = useState<'diff' | 'add_sub' | 'work'>('diff');

  // Mode 1: Time Difference
  const [startTime, setStartTime] = useState<string>('08:30');
  const [endTime, setEndTime] = useState<string>('17:15');

  // Mode 2: Add/Sub
  const [baseTime, setBaseTime] = useState<string>('14:00');
  const [opType, setOpType] = useState<'add' | 'sub'>('add');
  const [addHours, setAddHours] = useState<number>(3);
  const [addMinutes, setAddMinutes] = useState<number>(45);

  // Mode 3: Work Hours & Lunch
  const [workStart, setWorkStart] = useState<string>('08:00');
  const [workEnd, setWorkEnd] = useState<string>('17:00');
  const [breakMinutes, setBreakMinutes] = useState<number>(45);

  // Calculate Difference
  const calculateDifference = () => {
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);

    let t1 = h1 * 60 + m1;
    let t2 = h2 * 60 + m2;

    // Handle overnight if end time < start time
    if (t2 < t1) {
      t2 += 24 * 60;
    }

    const diffMins = t2 - t1;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    const decimalHours = (diffMins / 60).toFixed(2);
    const totalSeconds = diffMins * 60;

    return { hours, mins, totalMinutes: diffMins, decimalHours, totalSeconds };
  };

  // Calculate Add/Sub
  const calculateAddSub = () => {
    const [h, m] = baseTime.split(':').map(Number);
    let totalMins = h * 60 + m;
    const changeMins = addHours * 60 + addMinutes;

    if (opType === 'add') {
      totalMins = (totalMins + changeMins) % (24 * 60);
    } else {
      totalMins = (totalMins - changeMins + 24 * 60 * 10) % (24 * 60);
    }

    const resH = Math.floor(totalMins / 60).toString().padStart(2, '0');
    const resM = (totalMins % 60).toString().padStart(2, '0');
    return `${resH}:${resM}`;
  };

  // Calculate Work
  const calculateWork = () => {
    const [h1, m1] = workStart.split(':').map(Number);
    const [h2, m2] = workEnd.split(':').map(Number);

    let t1 = h1 * 60 + m1;
    let t2 = h2 * 60 + m2;

    if (t2 < t1) t2 += 24 * 60;

    const rawWorkMins = t2 - t1;
    const netMins = Math.max(0, rawWorkMins - breakMinutes);
    const hours = Math.floor(netMins / 60);
    const mins = netMins % 60;
    const decimalHours = (netMins / 60).toFixed(2);

    return { hours, mins, netMins, decimalHours };
  };

  const diffResult = calculateDifference();
  const addSubResult = calculateAddSub();
  const workResult = calculateWork();

  const primaryBtnColor = accentColor === 'orange' ? 'bg-[#ff9f0a] text-white' : 'bg-[#007aff] text-white';

  return (
    <div className={`flex-1 flex flex-col p-4 gap-3 overflow-y-auto no-scrollbar select-none justify-between ${
      isDarkMode ? 'bg-black text-white' : 'bg-[#faf9f5] text-slate-900'
    }`}>
      {/* Tab Switcher */}
      <div className={`grid grid-cols-3 p-1 rounded-2xl ${
        isDarkMode ? 'bg-[#1c1c1e]' : 'bg-[#e5e5ea]'
      }`}>
        <button
          onClick={() => {
            playTactileSound('switch', soundEnabled);
            triggerHaptic(10, hapticEnabled);
            setTab('diff');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'diff'
              ? isDarkMode ? 'bg-[#2c2c2e] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
              : isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {isFa ? 'اختلاف دو زمان' : 'Time Difference'}
        </button>

        <button
          onClick={() => {
            playTactileSound('switch', soundEnabled);
            triggerHaptic(10, hapticEnabled);
            setTab('add_sub');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'add_sub'
              ? isDarkMode ? 'bg-[#2c2c2e] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
              : isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {isFa ? 'افزودن / کاستن' : 'Add / Subtract'}
        </button>

        <button
          onClick={() => {
            playTactileSound('switch', soundEnabled);
            triggerHaptic(10, hapticEnabled);
            setTab('work');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'work'
              ? isDarkMode ? 'bg-[#2c2c2e] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
              : isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {isFa ? 'ساعت کاری' : 'Work Hours'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="space-y-3.5 my-auto">
        {tab === 'diff' && (
          <div className="space-y-3">
            {/* Input 1: Start Time */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
            }`}>
              <label className="text-xs font-bold block mb-1.5 opacity-80">
                {isFa ? 'زمان شروع (ساعت:دقیقه)' : 'Start Time'}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full text-2xl font-black font-mono-numbers px-3 py-2 rounded-xl outline-none ${
                  isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                }`}
              />
            </div>

            {/* Input 2: End Time */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
            }`}>
              <label className="text-xs font-bold block mb-1.5 opacity-80">
                {isFa ? 'زمان پایان (ساعت:دقیقه)' : 'End Time'}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`w-full text-2xl font-black font-mono-numbers px-3 py-2 rounded-xl outline-none ${
                  isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                }`}
              />
            </div>

            {/* Result Card */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#2c2c2e] border-blue-500/30' : 'bg-white border-blue-200 shadow-md'
            }`}>
              <div className="text-xs font-semibold text-blue-500 mb-1">
                {isFa ? 'مدت زمان سپری شده:' : 'Elapsed Duration:'}
              </div>
              <div className="text-3xl font-black font-mono-numbers text-blue-600">
                {diffResult.hours} <span className="text-sm font-bold">{isFa ? 'ساعت و' : 'h'}</span> {diffResult.mins} <span className="text-sm font-bold">{isFa ? 'دقیقه' : 'm'}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200/40 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="opacity-70">{isFa ? 'به صورت اعشاری:' : 'Decimal:'}</span>
                  <div className="font-bold font-mono-numbers text-sm">{diffResult.decimalHours} {isFa ? 'ساعت' : 'hours'}</div>
                </div>
                <div>
                  <span className="opacity-70">{isFa ? 'مجموع به دقیقه:' : 'Total minutes:'}</span>
                  <div className="font-bold font-mono-numbers text-sm">{diffResult.totalMinutes} {isFa ? 'دقیقه' : 'mins'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'add_sub' && (
          <div className="space-y-3">
            {/* Base Time */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
            }`}>
              <label className="text-xs font-bold block mb-1.5 opacity-80">
                {isFa ? 'زمان مبدأ' : 'Base Time'}
              </label>
              <input
                type="time"
                value={baseTime}
                onChange={(e) => setBaseTime(e.target.value)}
                className={`w-full text-2xl font-black font-mono-numbers px-3 py-2 rounded-xl outline-none ${
                  isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                }`}
              />
            </div>

            {/* Operator Switcher (+ or -) */}
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => setOpType('add')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  opType === 'add' ? primaryBtnColor : isDarkMode ? 'bg-[#1c1c1e] text-slate-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{isFa ? 'افزودن زمان' : 'Add Time'}</span>
              </button>
              <button
                onClick={() => setOpType('sub')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  opType === 'sub' ? primaryBtnColor : isDarkMode ? 'bg-[#1c1c1e] text-slate-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>{isFa ? 'کاستن زمان' : 'Subtract Time'}</span>
              </button>
            </div>

            {/* Hours and Minutes to change */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
              }`}>
                <label className="text-xs font-bold block mb-1 opacity-70">
                  {isFa ? 'ساعت' : 'Hours'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={addHours}
                  onChange={(e) => setAddHours(Math.max(0, Number(e.target.value)))}
                  className={`w-full text-xl font-bold font-mono-numbers px-2 py-1.5 rounded-lg outline-none ${
                    isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
              }`}>
                <label className="text-xs font-bold block mb-1 opacity-70">
                  {isFa ? 'دقیقه' : 'Minutes'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={addMinutes}
                  onChange={(e) => setAddMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className={`w-full text-xl font-bold font-mono-numbers px-2 py-1.5 rounded-lg outline-none ${
                    isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Result */}
            <div className={`p-4 rounded-2xl border text-center ${
              isDarkMode ? 'bg-[#2c2c2e] border-blue-500/30' : 'bg-white border-blue-200 shadow-md'
            }`}>
              <div className="text-xs font-semibold text-blue-500 mb-1">
                {isFa ? 'ساعت نهایی حاصل:' : 'Resulting Clock Time:'}
              </div>
              <div className="text-4xl font-black font-mono-numbers text-blue-600">
                {addSubResult}
              </div>
            </div>
          </div>
        )}

        {tab === 'work' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
              }`}>
                <label className="text-xs font-bold block mb-1 opacity-80">
                  {isFa ? 'ورود' : 'Clock In'}
                </label>
                <input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className={`w-full text-lg font-bold font-mono-numbers px-2 py-1.5 rounded-lg outline-none ${
                    isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
              }`}>
                <label className="text-xs font-bold block mb-1 opacity-80">
                  {isFa ? 'خروج' : 'Clock Out'}
                </label>
                <input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className={`w-full text-lg font-bold font-mono-numbers px-2 py-1.5 rounded-lg outline-none ${
                    isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Break */}
            <div className={`p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold opacity-80">
                  {isFa ? 'مدت زمان استراحت / ناهار (دقیقه)' : 'Break / Lunch (Minutes)'}
                </label>
                <span className="text-xs font-bold text-blue-500 font-mono-numbers">{breakMinutes} m</span>
              </div>
              <input
                type="number"
                min="0"
                max="240"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Math.max(0, Number(e.target.value)))}
                className={`w-full text-lg font-bold font-mono-numbers px-3 py-1.5 rounded-xl outline-none ${
                  isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-slate-100 text-slate-900'
                }`}
              />
            </div>

            {/* Work Result */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#2c2c2e] border-blue-500/30' : 'bg-white border-blue-200 shadow-md'
            }`}>
              <div className="text-xs font-semibold text-blue-500 mb-1">
                {isFa ? 'مجموع ساعات کاری خالص:' : 'Net Working Hours:'}
              </div>
              <div className="text-3xl font-black font-mono-numbers text-blue-600">
                {workResult.hours} <span className="text-sm font-bold">{isFa ? 'ساعت و' : 'h'}</span> {workResult.mins} <span className="text-sm font-bold">{isFa ? 'دقیقه' : 'm'}</span>
              </div>
              <div className="text-xs opacity-75 mt-1 font-mono-numbers">
                {isFa ? `معادل ${workResult.decimalHours} ساعت اعشاری کاری` : `${workResult.decimalHours} decimal work hours`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
