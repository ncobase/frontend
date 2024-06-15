import { isArray, isNumber, isObject } from './raw_type';

/**
 * 验证数字类型或初始化为 0
 * @param val 要验证或初始化的值。
 * @returns 如果值为数字，则返回该数字；否则返回 0。
 */
export const verifyNumber = (val: unknown): number => {
  val = !isNumber(val) ? Number(val) : val || 0;
  if (Number.isNaN(val)) val = 0;
  return Number(val);
};

/**
 * 比较两个值是否相等
 * @param a
 * @param b
 * @returns {boolean}
 */
export function isSameValue<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * 验证数组类型或初始化为空数组
 * @param arr 要验证或初始化的数组。
 * @returns 如果值为数组，则返回该数组；否则返回空数组 []。
 */
export const verifyArray = <T>(arr: unknown): T[] => (isArray<T>(arr) ? arr : []);

/**
 * 验证对象类型或初始化为空对象
 * @param obj 要验证或初始化的对象。
 * @returns 如果值为对象，则返回该对象；否则返回空对象{}。
 */
export const verifyObject = <T extends object>(obj: unknown): T =>
  isObject(obj) ? (obj as T) : ({} as T);
