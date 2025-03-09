import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PAYMENT_OPTIONS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTotalAmount = (selectedOptions: string[]): number => {
  return selectedOptions.reduce((total, optionId) => {
    const option = PAYMENT_OPTIONS.find((opt) => opt.id === optionId);
    return total + (option?.amount || 0);
  }, 0);
};

export const simulateOCR = async (file: File): Promise<{
  accountNumber: string;
  amount: number;
}> => {
  // Simulate OCR processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Mock OCR result
  return {
    accountNumber: "221010000",
    amount: 5000, // Mock amount
  };
};