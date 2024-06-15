/**
 * 获取字符串缩写
 * @param name
 */
export const getInitials = (name = '') =>
  name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map(v => v && v[0].toUpperCase())
    .join('') as string;

export const upperFirst = (str: string) => str.charAt(0).toLocaleUpperCase() + str.slice(1);

/**
 * 随机生成 ID
 * @returns {string} 随机生成的 ID.
 */
export function randomId(): string {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * 计算一个字符串的字节长度
 * @param val 输入的字符串
 * @returns 字节长度
 */
export function getByteLen(val: string): number {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    // eslint-disable-next-line no-control-regex
    if (val[i].match(/[^\x00-\xff]/gi) !== null) {
      len += 1;
    } else {
      len += 0.5;
    }
  }
  return Math.floor(len);
}

/**
 * 去除字符串两边的空格
 * @param str 输入的字符串
 * @returns {string}
 */

export function trim(str: string): string {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 拼接完整姓名
 * 格式：姓、中间字、名
 * @param firstName 姓
 * @param middleName 中间字
 * @param lastName 名
 * @returns {string}
 */
export function joinName(firstName?: string, middleName?: string, lastName?: string): string {
  const fullName =
    `${firstName?.trim() ?? ''} ${middleName?.trim() ?? ''} ${lastName?.trim() ?? ''}`.trim();
  return fullName;
}
