import React, { useState, useEffect, useCallback } from 'react';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidHeader } from './components/AndroidHeader';
import { AndroidNavigationDrawer } from './components/AndroidNavigationDrawer';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { Keypad } from './components/Keypad';
import { UnitConverter } from './components/UnitConverter';
import { TimeCalculator } from './components/TimeCalculator';
import { FinanceCalculator } from './components/FinanceCalculator';
import { DateCalculator } from './components/DateCalculator';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { AndroidFrame } from './components/AndroidFrame';
import { CalculatorMode, AppSettings, HistoryItem } from './types';
import { evaluateExpression, factorial } from './utils/calculator';
import { playTactileSound, triggerHaptic } from './utils/audio';

const STORAGE_KEY_SETTINGS = 'novacalc_ios_settings_v3';
const STORAGE_KEY_HISTORY = 'novacalc_ios_history_v3';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  isDarkMode: false, // Default Milky White background as requested
  accentColor: 'blue', // iOS Blue by default
  persianDigits: false, // Default English digits as requested
  language: 'fa',
  phoneFrame: true,
  angleUnit: 'deg',
  defaultTaxPercent: 10, // Default 10% tax
};

export default function App() {
  // Settings with LocalStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // History with LocalStorage persistence
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Calculator Core State
  const [currentMode, setCurrentMode] = useState<CalculatorMode>('standard');
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Keep dark class synced on HTML element
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // Save settings
  const updateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Save history
  const addHistoryItem = (expr: string, res: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: expr,
      result: res,
      timestamp: Date.now(),
      mode: currentMode,
    };
    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const clearHistory = () => {
    playTactileSound('clear', settings.soundEnabled);
    triggerHaptic(20, settings.hapticEnabled);
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // Ignore
    }
  };

  // Keyboard and Number Handling
  const handleNumber = useCallback((num: string) => {
    playTactileSound('num', settings.soundEnabled);
    triggerHaptic(10, settings.hapticEnabled);

    if (isEvaluated) {
      setExpression(num);
      setResult(num);
      setIsEvaluated(false);
      return;
    }

    setResult((prev) => {
      if (prev === '0' || prev === 'Error') return num;
      return prev + num;
    });

    setExpression((prev) => {
      return prev + num;
    });
  }, [isEvaluated, settings.soundEnabled, settings.hapticEnabled]);

  // Operator (+, −, ×, ÷)
  const handleOperator = useCallback((op: string) => {
    playTactileSound('op', settings.soundEnabled);
    triggerHaptic(15, settings.hapticEnabled);

    setIsEvaluated(false);

    if (expression === '' && result !== '0' && result !== 'Error') {
      setExpression(`${result} ${op} `);
      setResult('0');
      return;
    }

    const trimmed = expression.trim();
    const lastChar = trimmed.slice(-1);
    if (['+', '−', '×', '÷', '-'].includes(lastChar)) {
      setExpression(trimmed.slice(0, -1) + `${op} `);
      return;
    }

    setExpression((prev) => `${prev} ${op} `);
    setResult('0');
  }, [expression, result, settings.soundEnabled, settings.hapticEnabled]);

  // Decimal Point
  const handleDecimal = useCallback(() => {
    playTactileSound('num', settings.soundEnabled);
    triggerHaptic(10, settings.hapticEnabled);

    if (isEvaluated) {
      setExpression('0.');
      setResult('0.');
      setIsEvaluated(false);
      return;
    }

    if (!result.includes('.')) {
      setResult((prev) => prev + '.');
      setExpression((prev) => (prev === '' ? '0.' : prev + '.'));
    }
  }, [isEvaluated, result, settings.soundEnabled, settings.hapticEnabled]);

  // Equals (=)
  const handleEquals = useCallback(() => {
    playTactileSound('equals', settings.soundEnabled);
    triggerHaptic(25, settings.hapticEnabled);

    if (!expression && result === '0') return;

    const exprToEval = expression || result;
    const { result: evaluated, error } = evaluateExpression(exprToEval, {
      angleUnit: settings.angleUnit,
    });

    if (error || evaluated === 'Error') {
      setResult('Error');
    } else {
      addHistoryItem(exprToEval, evaluated);
      setResult(evaluated);
      setIsEvaluated(true);
    }
  }, [expression, result, settings.angleUnit, settings.soundEnabled, settings.hapticEnabled]);

  // Clear (C)
  const handleClear = useCallback(() => {
    playTactileSound('clear', settings.soundEnabled);
    triggerHaptic(20, settings.hapticEnabled);
    setExpression('');
    setResult('0');
    setIsEvaluated(false);
  }, [settings.soundEnabled, settings.hapticEnabled]);

  // Backspace (⌫)
  const handleBackspace = useCallback(() => {
    playTactileSound('delete', settings.soundEnabled);
    triggerHaptic(10, settings.hapticEnabled);

    if (isEvaluated) {
      handleClear();
      return;
    }

    if (result.length > 1) {
      setResult((prev) => prev.slice(0, -1));
    } else {
      setResult('0');
    }

    if (expression.length > 1) {
      setExpression((prev) => prev.slice(0, -1));
    } else {
      setExpression('');
    }
  }, [isEvaluated, result.length, expression.length, handleClear, settings.soundEnabled, settings.hapticEnabled]);

  // Negate (±)
  const handleNegate = useCallback(() => {
    playTactileSound('num', settings.soundEnabled);
    triggerHaptic(10, settings.hapticEnabled);

    if (result === '0' || result === 'Error') return;

    if (result.startsWith('-')) {
      const positive = result.slice(1);
      setResult(positive);
      setExpression((prev) => {
        if (prev.endsWith(result)) {
          return prev.slice(0, -result.length) + positive;
        }
        return positive;
      });
    } else {
      const negative = `-${result}`;
      setResult(negative);
      setExpression((prev) => {
        if (prev.endsWith(result)) {
          return prev.slice(0, -result.length) + negative;
        }
        return negative;
      });
    }
  }, [result, settings.soundEnabled, settings.hapticEnabled]);

  // Percentage (%)
  const handlePercentage = useCallback(() => {
    playTactileSound('op', settings.soundEnabled);
    triggerHaptic(12, settings.hapticEnabled);

    if (result === '0' || result === 'Error') return;
    const num = parseFloat(result);
    if (!isNaN(num)) {
      const pct = (num / 100).toString();
      setResult(pct);
      setExpression((prev) => prev + '%');
    }
  }, [result, settings.soundEnabled, settings.hapticEnabled]);

  // Parentheses ()
  const handleParenthesis = useCallback(() => {
    playTactileSound('op', settings.soundEnabled);
    triggerHaptic(12, settings.hapticEnabled);

    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;

    const lastChar = expression.trim().slice(-1);
    if (openCount > closeCount && /[0-9\)]/.test(lastChar)) {
      setExpression((prev) => prev + ')');
    } else {
      setExpression((prev) => (prev === '' ? '(' : prev + '('));
    }
  }, [expression, settings.soundEnabled, settings.hapticEnabled]);

  // Scientific Functions
  const handleScientificFunc = useCallback((fn: string) => {
    playTactileSound('op', settings.soundEnabled);
    triggerHaptic(15, settings.hapticEnabled);

    setIsEvaluated(false);

    switch (fn) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
      case 'ln':
      case 'log':
        setExpression((prev) => `${prev}${fn}(`);
        break;

      case 'sqrt':
        setExpression((prev) => `${prev}√(`);
        break;

      case 'cbrt':
        setExpression((prev) => `${prev}∛(`);
        break;

      case 'abs':
        setExpression((prev) => `${prev}abs(`);
        break;

      case 'pi':
        setExpression((prev) => `${prev}π`);
        setResult('3.14159265');
        break;

      case 'e':
        setExpression((prev) => `${prev}e`);
        setResult('2.71828182');
        break;

      case 'square':
        if (result !== '0') {
          const num = parseFloat(result);
          if (!isNaN(num)) {
            const sq = (num * num).toString();
            setResult(sq);
            setExpression((prev) => `${prev}^2`);
          }
        }
        break;

      case 'cube':
        if (result !== '0') {
          const num = parseFloat(result);
          if (!isNaN(num)) {
            const cube = (num * num * num).toString();
            setResult(cube);
            setExpression((prev) => `${prev}^3`);
          }
        }
        break;

      case 'power':
        setExpression((prev) => `${prev}^`);
        break;

      case 'inverse':
        if (result !== '0' && result !== 'Error') {
          const num = parseFloat(result);
          if (num !== 0) {
            const inv = (1 / num).toString();
            setResult(inv);
            setExpression(`1/(${result})`);
          }
        }
        break;

      case 'factorial':
        if (result !== 'Error') {
          const num = parseInt(result, 10);
          if (!isNaN(num)) {
            const f = factorial(num);
            setResult(f.toString());
            setExpression((prev) => `${prev}!`);
          }
        }
        break;

      default:
        break;
    }
  }, [result, settings.soundEnabled, settings.hapticEnabled]);

  // Memory Registers (MC, MR, M+, M-, MS)
  const handleMemoryClear = useCallback(() => {
    playTactileSound('clear', settings.soundEnabled);
    triggerHaptic(15, settings.hapticEnabled);
    setMemoryValue(0);
    setHasMemory(false);
  }, [settings.soundEnabled, settings.hapticEnabled]);

  const handleMemoryRecall = useCallback(() => {
    playTactileSound('num', settings.soundEnabled);
    triggerHaptic(15, settings.hapticEnabled);
    if (hasMemory) {
      setResult(memoryValue.toString());
      setExpression((prev) => prev + memoryValue.toString());
    }
  }, [hasMemory, memoryValue, settings.soundEnabled, settings.hapticEnabled]);

  const handleMemoryAdd = useCallback(() => {
    playTactileSound('op', settings.soundEnabled);
    triggerHaptic(15, settings.hapticEnabled);
    const val = parseFloat(result) || 0;
    setMemoryValue((prev) => prev + val);
    setHasMemory(true);
  }, [result, settings.soundEnabled, settings.hapticEnabled]);

  const handleMemorySubtract = useCallback(() => {
    playTactileSound('op', settings.soundEnabled);
    triggerHaptic(15, settings.hapticEnabled);
    const val = parseFloat(result) || 0;
    setMemoryValue((prev) => prev - val);
    setHasMemory(true);
  }, [result, settings.soundEnabled, settings.hapticEnabled]);

  const handleMemoryStore = useCallback(() => {
    playTactileSound('op', settings.soundEnabled);
    triggerHaptic(20, settings.hapticEnabled);
    const val = parseFloat(result) || 0;
    setMemoryValue(val);
    setHasMemory(true);
  }, [result, settings.soundEnabled, settings.hapticEnabled]);

  // Restore item from history
  const handleSelectCalculation = (item: HistoryItem) => {
    playTactileSound('tap', settings.soundEnabled);
    triggerHaptic(15, settings.hapticEnabled);
    setExpression(item.expression);
    setResult(item.result);
    setIsEvaluated(true);
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHistoryOpen || isSettingsOpen || isDrawerOpen) return;
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleNumber(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      } else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleParenthesis();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isHistoryOpen,
    isSettingsOpen,
    isDrawerOpen,
    handleNumber,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
    handleDecimal,
    handlePercentage,
    handleParenthesis,
  ]);

  return (
    <AndroidFrame
      isFrameMode={settings.phoneFrame}
      onToggleFrameMode={() => updateSettings({ phoneFrame: !settings.phoneFrame })}
      isDarkMode={settings.isDarkMode}
      language={settings.language}
    >
      {/* 1. Status Bar */}
      <AndroidStatusBar
        soundEnabled={settings.soundEnabled}
        persianDigits={settings.persianDigits}
        isDarkMode={settings.isDarkMode}
        onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
      />

      {/* 2. Top Header with Hamburger, Dark Mode Toggle, and Actions */}
      <AndroidHeader
        currentMode={currentMode}
        onSelectMode={(mode) => {
          playTactileSound('switch', settings.soundEnabled);
          triggerHaptic(12, settings.hapticEnabled);
          setCurrentMode(mode);
        }}
        onOpenDrawer={() => {
          playTactileSound('switch', settings.soundEnabled);
          triggerHaptic(12, settings.hapticEnabled);
          setIsDrawerOpen(true);
        }}
        onOpenHistory={() => {
          playTactileSound('switch', settings.soundEnabled);
          triggerHaptic(12, settings.hapticEnabled);
          setIsHistoryOpen(true);
        }}
        onOpenSettings={() => {
          playTactileSound('switch', settings.soundEnabled);
          triggerHaptic(12, settings.hapticEnabled);
          setIsSettingsOpen(true);
        }}
        onToggleDarkMode={() => {
          playTactileSound('switch', settings.soundEnabled);
          updateSettings({ isDarkMode: !settings.isDarkMode });
        }}
        isDarkMode={settings.isDarkMode}
        historyCount={history.length}
        language={settings.language}
      />

      {/* 3. Main Views by Mode: Default is PURE CALCULATOR */}
      {currentMode === 'standard' || currentMode === 'scientific' ? (
        <div className={`flex-1 flex flex-col justify-between overflow-hidden ${
          settings.isDarkMode ? 'bg-black' : 'bg-[#faf9f5]'
        }`}>
          {/* Display screen (DEG/RAD hidden in standard mode!) */}
          <CalculatorDisplay
            expression={expression}
            result={result}
            angleUnit={settings.angleUnit}
            onToggleAngleUnit={() => {
              playTactileSound('switch', settings.soundEnabled);
              updateSettings({ angleUnit: settings.angleUnit === 'deg' ? 'rad' : 'deg' });
            }}
            hasMemory={hasMemory}
            memoryValue={memoryValue}
            onBackspace={handleBackspace}
            onClearAll={handleClear}
            persianDigits={settings.persianDigits}
            isDarkMode={settings.isDarkMode}
            isScientificMode={currentMode === 'scientific'}
          />

          {/* Keypad: Operators (÷, ×, −, +, =) strictly on the RIGHT, C & MC in English */}
          <Keypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onScientificFunc={handleScientificFunc}
            onClear={handleClear}
            onEquals={handleEquals}
            onParenthesis={handleParenthesis}
            onPercentage={handlePercentage}
            onNegate={handleNegate}
            onDecimal={handleDecimal}
            onMemoryClear={handleMemoryClear}
            onMemoryRecall={handleMemoryRecall}
            onMemoryAdd={handleMemoryAdd}
            onMemorySubtract={handleMemorySubtract}
            onMemoryStore={handleMemoryStore}
            hasMemory={hasMemory}
            persianDigits={settings.persianDigits}
            isDarkMode={settings.isDarkMode}
            accentColor={settings.accentColor}
            isScientificMode={currentMode === 'scientific'}
            angleUnit={settings.angleUnit}
            onToggleAngleUnit={() => {
              playTactileSound('switch', settings.soundEnabled);
              updateSettings({ angleUnit: settings.angleUnit === 'deg' ? 'rad' : 'deg' });
            }}
          />
        </div>
      ) : currentMode === 'time' ? (
        <TimeCalculator
          isDarkMode={settings.isDarkMode}
          accentColor={settings.accentColor}
          language={settings.language}
          soundEnabled={settings.soundEnabled}
          hapticEnabled={settings.hapticEnabled}
        />
      ) : currentMode === 'converter' ? (
        <UnitConverter
          isDarkMode={settings.isDarkMode}
          accentColor={settings.accentColor}
          persianDigits={settings.persianDigits}
          language={settings.language}
          soundEnabled={settings.soundEnabled}
          hapticEnabled={settings.hapticEnabled}
        />
      ) : currentMode === 'finance' ? (
        <FinanceCalculator
          isDarkMode={settings.isDarkMode}
          accentColor={settings.accentColor}
          persianDigits={settings.persianDigits}
          language={settings.language}
          soundEnabled={settings.soundEnabled}
          hapticEnabled={settings.hapticEnabled}
          defaultTaxPercent={settings.defaultTaxPercent ?? 10}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        <DateCalculator
          isDarkMode={settings.isDarkMode}
          persianDigits={settings.persianDigits}
          language={settings.language}
        />
      )}

      {/* 4. Side Navigation Drawer */}
      <AndroidNavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
        isDarkMode={settings.isDarkMode}
        language={settings.language}
      />

      {/* 5. History Drawer Sheet */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectCalculation={handleSelectCalculation}
        onClearHistory={clearHistory}
        persianDigits={settings.persianDigits}
        isDarkMode={settings.isDarkMode}
        language={settings.language}
      />

      {/* 6. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </AndroidFrame>
  );
}
