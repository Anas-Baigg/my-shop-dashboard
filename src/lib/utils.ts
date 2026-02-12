import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// NEW: Centralized currency formatter
export const formatEUR = (amount: number | null | undefined) => {
  const value = amount || 0; // Handle null/undefined gracefully
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};