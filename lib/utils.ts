import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// FORMATTING UTILITIES
// ============================================

export function formatCurrency(amount: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: string = 'en-IN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date, locale: string = 'en-IN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatPhoneNumber(phone: string): string {
  // Format Indian phone numbers: +91-XXXXX-XXXXX or XXXXX-XXXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91-${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

// ============================================
// CALCULATION UTILITIES
// ============================================

export function calculateTotal(items: { quantity: number; unit_price: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
}

export function calculateOrderItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // 10 digits or +91 followed by 10 digits
  return /^([6-9]\d{9}|91[6-9]\d{9})$/.test(cleaned);
}

// ============================================
// OFFLINE SYNC UTILITIES
// ============================================

export function generateDeviceId(): string {
  return `device_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let deviceId = localStorage.getItem('mandi_device_id');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('mandi_device_id', deviceId);
  }
  return deviceId;
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

// ============================================
// DEBOUNCE/THROTTLE UTILITIES
// ============================================

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
