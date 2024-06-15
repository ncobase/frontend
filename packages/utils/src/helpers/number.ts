/**
 * 转换为数字
 * @param { string } val
 */
export const toNumber = (val: string): number => +val;

/**
 * 保留小数位
 * @param value 原始值
 * @param length 保留长度，默认 2 位
 * @returns 返回处理结果
 */
export const decimals = (value: number | string = 0, length = 2): number => {
  if (value === 0 || value === '0.00' || Number.isNaN(value)) return 0.0;
  value = typeof value === 'string' ? parseFloat(value) : value;
  return Math.round(parseFloat(value.toFixed(length)) * 100) / 100;
};

/**
 * 把小数转换为百分数
 * @param val 字段值
 * @param pre 百分数保留的小数位，默认为 2
 * @returns 带百分号后缀
 */
export function decimalToPercent(val: number | string, pre = 2): string | null {
  if (typeof val === 'string' && val) {
    val = Number(val);
  }
  if (!(typeof val === 'number' && !Number.isNaN(val))) {
    return null;
  }
  val = val * 100;
  const p = Math.pow(10, pre);
  val = Math.round(val * p) / p;
  return val.toFixed(pre) + '%';
}

/**
 * 将数值四舍五入 (保留 2 位小数) 后格式化成金额形式
 * @param num 数值
 * @return 金额格式的字符串，如'1,234,567.45'
 */
export function formatCurrency(num: any): string {
  num = num.toString().replace(/[$,]/g, '');
  if (Number.isNaN(Number(num))) {
    num = '0';
  }
  const sign = num == (num = Math.abs(Number(num)));
  num = Math.floor(Number(num) * 100 + 0.50000000001);
  let cents: any = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num =
      num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }
  return (sign ? '' : '-') + num + '.' + cents;
}
