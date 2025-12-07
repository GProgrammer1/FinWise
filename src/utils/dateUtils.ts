import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE');
  }
  
  if (isThisMonth(dateObj)) {
    return format(dateObj, 'MMM dd');
  }
  
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatCurrency = (amount: number): string => {
  return `$${Math.abs(amount).toFixed(2)}`;
};

