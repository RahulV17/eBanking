export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function maskAccountNumber(accountNumber: number | string): string {
  const str = String(accountNumber);
  return '****' + str.slice(-4);
}
