// Safe, robust mathematical evaluation engine for NovaCalc

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str.replace(/[0-9]/g, (char) => PERSIAN_DIGITS[parseInt(char, 10)] || char);
}

export function toEnglishDigits(input: string): string {
  if (!input) return '';
  let res = input;
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(PERSIAN_DIGITS[i], ENGLISH_DIGITS[i]);
  }
  return res;
}

// Format numbers with commas (e.g., 1,234,567.89)
export function formatWithCommas(valStr: string, usePersian = false): string {
  if (!valStr) return '0';
  if (valStr === 'Error' || valStr === 'NaN' || valStr === 'Infinity' || valStr === '-Infinity') {
    return usePersian ? 'خطا' : 'Error';
  }

  // Check if expression or single number
  const isSingleNumber = /^-?\d+(\.\d*)?$/.test(valStr);
  if (!isSingleNumber) {
    return usePersian ? toPersianDigits(valStr) : valStr;
  }

  const parts = valStr.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? '.' + parts[1] : '';

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const combined = formattedInt + decPart;
  return usePersian ? toPersianDigits(combined) : combined;
}

// Calculate factorial
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JS overflow
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export interface EvalOptions {
  angleUnit: 'deg' | 'rad';
}

export function evaluateExpression(expr: string, options: EvalOptions = { angleUnit: 'deg' }): { result: string; error?: string } {
  try {
    let clean = expr.trim();
    if (!clean) return { result: '0' };

    // Standardize symbols
    clean = clean.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    clean = toEnglishDigits(clean);

    // Replace constants
    clean = clean.replace(/π/g, `(${Math.PI})`);
    clean = clean.replace(/e(?![a-zA-Z0-9])/g, `(${Math.E})`);

    // Handle scientific functions with DEG/RAD conversion
    const isDeg = options.angleUnit === 'deg';
    const toRadFactor = isDeg ? `*(Math.PI/180)` : '';
    const fromRadFactor = isDeg ? `*(180/Math.PI)` : '';

    // Replace trigonometric functions
    // Handle asin, acos, atan first to avoid colliding with sin, cos, tan
    clean = clean.replace(/asin\(([^)]+)\)/g, `(Math.asin($1)${fromRadFactor})`);
    clean = clean.replace(/acos\(([^)]+)\)/g, `(Math.acos($1)${fromRadFactor})`);
    clean = clean.replace(/atan\(([^)]+)\)/g, `(Math.atan($1)${fromRadFactor})`);

    clean = clean.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${toRadFactor})`);
    clean = clean.replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${toRadFactor})`);
    clean = clean.replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${toRadFactor})`);

    // Logarithms
    clean = clean.replace(/ln\(([^)]+)\)/g, `Math.log($1)`);
    clean = clean.replace(/log\(([^)]+)\)/g, `Math.log10($1)`);

    // Roots and powers
    clean = clean.replace(/√\(([^)]+)\)/g, `Math.sqrt($1)`);
    clean = clean.replace(/∛\(([^)]+)\)/g, `Math.cbrt($1)`);
    clean = clean.replace(/abs\(([^)]+)\)/g, `Math.abs($1)`);

    // Power operator ^
    clean = clean.replace(/(\d+(\.\d+)?|\([^)]+\))\^(\d+(\.\d+)?|\([^)]+\))/g, `Math.pow($1, $3)`);

    // Percent handling
    clean = clean.replace(/(\d+(\.\d+)?)%/g, `($1/100)`);

    // Sanitize check: allow only numbers, math functions, operators, parentheses
    const safeRegex = /^[0-9+\-*/()., MathpowsqrtcbrtasincostanabslogEPI\s]+$/;
    if (!safeRegex.test(clean)) {
      return { result: 'Error', error: 'Invalid characters in expression' };
    }

    // Evaluate in safe function context
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const evaluated = Function(`"use strict"; return (${clean});`)();

    if (typeof evaluated !== 'number' || isNaN(evaluated)) {
      return { result: 'Error', error: 'Result is undefined' };
    }

    if (!isFinite(evaluated)) {
      return { result: evaluated > 0 ? 'Infinity' : '-Infinity', error: 'Division by zero' };
    }

    // Clean floating point inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004)
    const rounded = Number(Math.round(Number(evaluated + 'e12')) + 'e-12');
    
    // Convert scientific notation if very large/small or clean string
    let resStr = rounded.toString();
    if (resStr.includes('e')) {
      const parsed = parseFloat(resStr);
      if (Math.abs(parsed) < 1e14 && Math.abs(parsed) > 1e-6) {
        resStr = parsed.toFixed(10).replace(/\.?0+$/, '');
      }
    }

    return { result: resStr };
  } catch {
    return { result: 'Error', error: 'Syntax Error' };
  }
}
