import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Volume2, VolumeX } from 'lucide-react';
import { toPersianDigits } from '../utils/calculator';

interface AndroidStatusBarProps {
  soundEnabled: boolean;
  persianDigits: boolean;
  isDarkMode: boolean;
  onToggleSound: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  soundEnabled,
  persianDigits,
  isDarkMode,
  onToggleSound,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const displayTime = persianDigits ? toPersianDigits(time) : time;
  const batteryPct = persianDigits ? `${toPersianDigits('96')}%` : '96%';

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold select-none z-20 transition-colors ${
      isDarkMode ? 'bg-black text-white' : 'bg-[#faf9f5] text-slate-800'
    }`}>
      {/* Left: Time */}
      <div className="flex items-center gap-2">
        <span className="font-bold tracking-wider font-mono-numbers">
          {displayTime}
        </span>
      </div>

      {/* Right: Network, Audio, Battery */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'صدا فعال' : 'صدا غیرفعال'}
          className="hover:text-blue-500 transition-colors p-0.5"
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 opacity-40" />
          )}
        </button>
        <span className="text-[10px] font-bold text-blue-500 tracking-tighter">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono-numbers">{batteryPct}</span>
          <BatteryMedium className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};
