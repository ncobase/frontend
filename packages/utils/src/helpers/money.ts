import { verifyNumber } from './validator';

/**
 * 计算返点使用金额
 * @param tm 金额
 * @param om 原金额
 * @param um 返点使用总金额
 * @returns {number}
 */
export function calRebateMoney(tm: number, om: number, um: number): number {
  tm = verifyNumber(tm);
  om = verifyNumber(om);
  um = verifyNumber(um);
  return (tm / om) * um || 0;
}

/**
 * 根据比例计算金额
 * @param tm 类型金额
 * @param p 比例
 * @returns {number}
 */
export function calRebateRRMoney(tm: number, p: number): number {
  tm = verifyNumber(tm);
  p = verifyNumber(p);
  return tm * (p / 100) || 0;
}

/**
 * 根据使用金额计算比例
 * @param um 使用金额
 * @param om 原金额
 * @returns {number}
 */
export function calPercent(um: number, om: number): number {
  um = verifyNumber(um);
  om = verifyNumber(om);
  return 100 * (um / om) || 0;
}
