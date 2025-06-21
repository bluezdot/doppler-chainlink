export const formatBigIntToUsd = (value: bigint | string) => {
  return (Number(value) / 10 ** 18).toFixed(10);
};

export const formatPrice = (num: number | string, fixed: boolean = false): string => {
  const str = num.toString();
  if (Number(num) >= 1) return Number(num).toFixed(4);
  if (str.includes('e-')) return str; // Already in scientific notation

  const match = str.match(/^0\.0*(?=[1-9])/);
  if (!match) return str;

  const zeros = match[0].length - 2; // Subtract "0."
  const significant = str.substring(match[0].length);
  if (zeros > 2) return `0.0(${zeros})${significant.slice(0, 3)}`;
  if (fixed) return parseFloat(str).toFixed(zeros + 3);
  return str;
};

export const shortenAddress = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

export function timestampToMinutesAgo(timestampStr) {
  const timestampSec = parseInt(timestampStr, 10);
  const nowMs = Date.now();
  const timestampMs = timestampSec * 1000;

  const diffMs = nowMs - timestampMs;
  const diffSec = Math.floor(diffMs / 1000);

  const minutes = Math.floor(diffSec / 60);
  const hours = Math.floor(diffSec / 3600);
  const days = Math.floor(diffSec / (3600 * 24));
  const months = Math.floor(diffSec / (3600 * 24 * 30));
  const years = Math.floor(diffSec / (3600 * 24 * 365));

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `just now`;
  }
}

export const getProgressPercent = (
  numerator: string | number | bigint,
  denominator: string | number | bigint
) => {
  if (!denominator || denominator === '0' || denominator === 0n) return 0;

  // Convert to numbers safely
  const num = typeof numerator === 'bigint' ? Number(numerator) : Number(numerator);
  const denom = typeof denominator === 'bigint' ? Number(denominator) : Number(denominator);

  if (denom === 0 || isNaN(num) || isNaN(denom)) return 0;

  return Math.min((num / denom) * 100, 100);
};
