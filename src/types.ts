export type CalculatorMode = 
  | 'standard' 
  | 'scientific' 
  | 'converter' 
  | 'finance' 
  | 'date' 
  | 'time';

export type AppTheme = 'milky-white' | 'dark-mode';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: CalculatorMode;
}

export type UnitCategory = 
  | 'length' 
  | 'weight' 
  | 'temperature' 
  | 'currency' 
  | 'storage' 
  | 'speed' 
  | 'area'
  | 'volume'
  | 'time'
  | 'pressure'
  | 'fuel';

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  isDarkMode: boolean;
  accentColor: 'blue' | 'orange';
  persianDigits: boolean;
  language: 'fa' | 'en';
  phoneFrame: boolean;
  angleUnit: 'deg' | 'rad';
  defaultTaxPercent: number; // Default 10%
}
