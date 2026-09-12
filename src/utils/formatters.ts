import { CurrencyCode, UnitSystem } from '../types';

// Exchange rates relative to 1 USD
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  LKR: 310, // Gives Rs. 1,326,955 for ~$4,280.50 matching the screenshot mockup!
  EUR: 0.92,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  LKR: 'Rs.',
  EUR: '€',
};

/**
 * Format a base USD amount to the target currency with proper formatting and symbols
 */
export function formatCurrency(
  baseUsdAmount: number,
  targetCurrency: CurrencyCode,
  includeDecimals: boolean = true
): string {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  const converted = baseUsdAmount * rate;

  if (targetCurrency === 'LKR') {
    // LKR commonly formatted without cents for large values
    return `Rs. ${Math.round(converted).toLocaleString('en-US')}`;
  }

  if (targetCurrency === 'EUR') {
    return `€${converted.toLocaleString('en-US', {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    })}`;
  }

  return `$${converted.toLocaleString('en-US', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  })}`;
}

/**
 * Convert weight in kg according to unit system
 */
export function formatWeight(kg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const lbs = kg * 2.20462;
    return `${lbs.toFixed(1)} lbs`;
  }
  return `${kg.toFixed(1)} kg`;
}

/**
 * Convert height in cm according to unit system
 */
export function formatHeight(cm: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

/**
 * Convert ml to display string (e.g. 1.80 L or 60.8 fl oz)
 */
export function formatVolume(ml: number, units: UnitSystem): { value: string; unit: string } {
  if (units === 'imperial') {
    const flOz = ml * 0.033814;
    return {
      value: flOz.toFixed(1),
      unit: 'fl oz',
    };
  }
  const liters = ml / 1000;
  return {
    value: liters.toFixed(2),
    unit: 'L',
  };
}
