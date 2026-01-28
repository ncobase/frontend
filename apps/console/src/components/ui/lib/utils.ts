import { cn as cnUtil } from '@ncobase/utils';

/**
 * Conditionally join class names
 */
export const cn = cnUtil;

/**
 * Format a date value
 * @param date The date to format
 * @param options Options for the date formatter
 * @param locale Locale for formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  },
  locale = 'en-US'
) {
  return new Intl.DateTimeFormat(locale, options).format(
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  );
}

/**
 * Generate a unique ID
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export function uniqueId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Check if a value is a valid object
 * @param value The value to check
 * @returns Whether the value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Debounce a function
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced function
 */
export function debounce<T extends (..._args: any[]) => any>(
  fn: T,
  delay: number
): {
  (..._args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  function debouncedFn(...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  }

  debouncedFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFn;
}

/**
 * Throttle a function
 * @param fn The function to throttle
 * @param delay The delay in milliseconds
 * @returns The throttled function
 */
export function throttle<T extends (..._args: any[]) => any>(
  fn: T,
  delay: number
): {
  (..._args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime = 0;

  function throttledFn(...args: Parameters<T>): void {
    const now = Date.now();
    lastArgs = args;

    if (now - lastCallTime >= delay) {
      fn(...args);
      lastCallTime = now;
      lastArgs = null;
    } else if (!timeout) {
      timeout = setTimeout(
        () => {
          if (lastArgs) {
            fn(...lastArgs);
            lastCallTime = Date.now();
            lastArgs = null;
          }
          timeout = null;
        },
        delay - (now - lastCallTime)
      );
    }
  }

  throttledFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = null;
  };

  return throttledFn;
}

/**
 * Convert a string to a slug
 * @param str The string to convert
 * @returns The slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate a string to a specified length
 * @param str The string to truncate
 * @param length The maximum length
 * @param ending The ending to append (e.g., "...")
 * @returns The truncated string
 */
export function truncate(str: string, length: number, ending: string = '...'): string {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
}

/**
 * Deep merge two objects
 * @param target The target object
 * @param source The source object
 * @returns The merged object
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>
): T {
  const result = { ...target } as T;
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key];
      const targetValue = result[key as keyof T];
      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key as keyof T] = deepMerge(targetValue, sourceValue) as T[keyof T];
      } else {
        result[key as keyof T] = sourceValue as T[keyof T];
      }
    });
  }
  return result;
}

/**
 * Count words in a string, with proper handling of HTML content
 * @param str The string to count words in
 * @returns The number of words
 */
export function countWords(str: string): number {
  // Remove HTML tags
  const text = str.replace(/<[^>]*>/g, ' ');
  // Remove special characters and extra spaces
  const cleanText = text
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Count words
  return cleanText ? cleanText.split(' ').length : 0;
}

/**
 * Count characters in a string, with proper handling of HTML content
 * @param str The string to count characters in
 * @param countSpaces Whether to count spaces
 * @param includeHtml Whether to include HTML tags in the count
 * @returns The number of characters
 */
export function countCharacters(
  str: string,
  countSpaces: boolean = true,
  includeHtml: boolean = false
): number {
  // Process the string
  const text = includeHtml ? str : str.replace(/<[^>]*>/g, ' ');

  if (countSpaces) {
    return text.length;
  }

  // Remove spaces
  return text.replace(/\s+/g, '').length;
}

/**
 * Safely parse JSON
 * @param str The string to parse
 * @param fallback The fallback value if parsing fails
 * @returns The parsed value or fallback
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (e) {
    return fallback;
  }
}

/**
 * Get a value from local storage with proper typing
 * @param key The key to get
 * @param defaultValue The default value if the key doesn't exist
 * @returns The value from local storage or the default value
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return safeJsonParse<T>(item, defaultValue);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Set a value in local storage
 * @param key The key to set
 * @param value The value to set
 * @returns Whether the operation was successful
 */
export function setInStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

/**
 * Normalize HTML for better consistency
 * @param html The HTML string to normalize
 * @returns The normalized HTML
 */
export function normalizeHtml(html: string): string {
  if (!html) return '';

  // Replace multiple newlines with a single one
  let normalized = html.replace(/(\r\n|\n|\r){2,}/g, '\n');

  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ');

  // Ensure self-closing tags are properly formatted (e.g., <br> to <br />)
  normalized = normalized.replace(/<(br|hr|img|input|meta|link)([^>]*)>/gi, '<$1$2 />');

  return normalized.trim();
}

/**
 * Strip all HTML tags from a string
 * @param html The HTML string to strip
 * @returns The string without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  // Create a new div element
  const tmp = document.createElement('div');

  // Set the HTML content
  tmp.innerHTML = html;

  // Get the text content
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Check if the browser supports a specific feature
 * @param feature The feature to check
 * @returns Whether the feature is supported
 */
export function isFeatureSupported(feature: string): boolean {
  switch (feature) {
    case 'clipboard':
      return !!navigator.clipboard;
    case 'fullscreen':
      return !!document.fullscreenEnabled;
    case 'webp': {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    case 'touch':
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    case 'localStorage':
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e) {
        return false;
      }
    default:
      return false;
  }
}

/**
 * Sanitize HTML string by removing potentially malicious content
 * @param html The HTML string to sanitize
 * @returns The sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Create a new div element
  const tmp = document.createElement('div');

  // Set the HTML content
  tmp.innerHTML = html;

  // Remove potentially dangerous elements and attributes
  const dangerous = ['script', 'iframe', 'object', 'embed', 'form', 'input[type="password"]'];
  dangerous.forEach(selector => {
    tmp.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Remove dangerous attributes
  const attrs = [
    'onerror',
    'onload',
    'onclick',
    'onmouseover',
    'onmouseout',
    'onkeydown',
    'onkeypress'
  ];
  tmp.querySelectorAll('*').forEach(el => {
    attrs.forEach(attr => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });

    // Remove javascript: URLs
    if (el.hasAttribute('href') && el.getAttribute('href')?.startsWith('javascript:')) {
      el.removeAttribute('href');
    }
    if (el.hasAttribute('src') && el.getAttribute('src')?.startsWith('javascript:')) {
      el.removeAttribute('src');
    }
  });

  return tmp.innerHTML;
}
