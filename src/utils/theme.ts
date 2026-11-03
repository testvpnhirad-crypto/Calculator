import { AppTheme } from '../types';

export interface ThemeColors {
  id: AppTheme;
  nameFa: string;
  nameEn: string;
  bgCanvas: string;
  bgSurface: string;
  displayText: string;
}

export const THEMES: Record<AppTheme, ThemeColors> = {
  'milky-white': {
    id: 'milky-white',
    nameFa: 'سفید شیری اپل',
    nameEn: 'Milky White iOS',
    bgCanvas: 'bg-[#f4f3ee]',
    bgSurface: 'bg-[#faf9f5]',
    displayText: 'text-slate-900',
  },
  'dark-mode': {
    id: 'dark-mode',
    nameFa: 'دارک مود آیفون',
    nameEn: 'iOS Dark Mode',
    bgCanvas: 'bg-[#121214]',
    bgSurface: 'bg-black',
    displayText: 'text-white',
  },
};
