export const USD_TO_CDF_RATE = 2850;

export function formatMoney(amountUsd: number, currency: string = 'USD'): string {
  if (currency === 'CDF') {
    const cdfValue = Math.round(amountUsd * USD_TO_CDF_RATE);
    return `${cdfValue.toLocaleString('fr-FR')} CDF`;
  }
  return `$${amountUsd.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}
