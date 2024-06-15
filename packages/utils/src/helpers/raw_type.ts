// noinspection JSUnusedGlobalSymbols

const _rawType = (o: unknown): string => Object.prototype.toString.call(o).slice(8, -1);

/**
 * 验证一个值是否为 undefined。
 * @param un 要验证的值。
 * @returns 如果值为 undefined，则返回 true，否则返回 false。
 */
export const isUndefined = (un: unknown): boolean => _rawType(un) === 'Undefined';

/**
 * 验证一个值是否为数字。
 * @param num 要验证的值。
 * @returns 如果值为数字，则返回 true，否则返回 false。
 */
export const isNumber = (num: unknown): boolean => _rawType(num) === 'Number';

/**
 * 验证一个值是否为字符串。
 * @param str 要验证的值。
 * @returns 如果值为字符串，则返回 true，否则返回 false。
 */
export const isString = (str: unknown): boolean => _rawType(str) === 'String';

/**
 * 验证一个值是否为对象。
 * @param obj 要验证的值。
 * @returns 如果值为对象，则返回 true，否则返回 false。
 */
export const isObject = (obj: unknown): boolean => _rawType(obj) === 'Object';

/**
 * 验证一个值是否为数组。
 * @param arr 要验证的值。
 * @returns 如果值为数组，则返回 true，否则返回 false。
 */
export const isArray = <T>(arr: unknown): arr is T[] => Array.isArray(arr);

/**
 * 验证一个值是否为函数。
 * @param fn 要验证的值。
 * @returns 如果值为函数，则返回 true，否则返回 false。
 */
export const isFunction = (fn: unknown): boolean => _rawType(fn) === 'Function';

/**
 * 验证一个值是否为布尔值。
 * @param bool 要验证的值。
 * @returns 如果值为布尔值，则返回 true，否则返回 false。
 */
export const isBoolean = (bool: unknown): boolean => _rawType(bool) === 'Boolean';

/**
 * 验证一个值是否为 Null。
 * @param n 要验证的值。
 * @returns 如果值为 Null，则返回 true，否则返回 false。
 */
export const isNull = (n: unknown): boolean => _rawType(n) === 'Null';
