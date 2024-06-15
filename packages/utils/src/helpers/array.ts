import { isSameValue, verifyArray, verifyObject } from './validator';

/**
 * 生成一个随机数数组。
 * @param length 数组的长度。
 * @param maxNumber 随机数的最大值。如果未指定或无效，则默认为 2000。
 * @returns 随机数数组
 */
export const mathArr = (length: number, maxNumber?: number | string): number[] => {
  const arr: number[] = [];
  const max: number =
    maxNumber && !Number.isNaN(parseFloat(maxNumber as string))
      ? parseFloat(maxNumber as string)
      : 2000;

  for (let i = 0; i < length; i++) {
    const r: number = Math.random() * (max - 1) + 1;
    arr.push(parseFloat(r.toFixed(2)));
  }

  return arr;
};

/**
 * 从数组中删除 null 或 undefined 元素
 * @param actual 数组
 * @returns 删除了 null 或 undefined 元素的新数组
 */
export function cleanArray<T>(actual: Array<T | null | undefined>): T[] {
  const newArray: T[] = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== null && actual[i] !== undefined) {
      newArray.push(actual[i] as T);
    }
  }
  return newArray;
}

/**
 * 比较两个数组对象，是否只存在于左边数组
 * @param left 左边数组
 * @param right 右边数组
 * @param opts 扩展参数
 * @param opts.lk 左边数组取值 key
 * @param opts.rk 右边数组取值 key
 * @returns {*[]}
 */
export function onlyInLeft<T, U>(left: T[], right: U[], opts: { lk?: keyof T; rk?: keyof U }): T[] {
  left = verifyArray(left);
  right = verifyArray(right);
  opts = verifyObject(opts);

  return left.filter(o => {
    return !right.some(t => {
      const lv = opts.lk ? o[opts.lk] : (o as unknown as { id: any }).id;
      const rv = opts.rk ? t[opts.rk] : (t as unknown as { id: any }).id;
      return isSameValue(lv, rv);
    });
  });
}
