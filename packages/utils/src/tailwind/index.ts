import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * 将多个类合并为一个字符串，使用 tailwind-merge 进行合并
 * @param inputs - 类值
 * @returns {string} 合并后的类字符串
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
