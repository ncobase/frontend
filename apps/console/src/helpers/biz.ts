import { nanoid } from '@ncobase/utils';

/**
 * digit align
 * @param {number} num number
 * @returns {string} string
 */
const digitAlign = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

/**
 * Biz Code
 * @description generate biz code, format: BCYYYYMMDDWXXXXS
 * @param {{prefix: string, suffix: string}}
 * @param prefix prefix
 * @param suffix suffix
 * @returns {string} biz code
 */
export const bizCode = (
  {
    prefix,
    suffix
  }: {
    prefix?: string;
    suffix?: string;
  } = { prefix: 'BC', suffix: 'S' }
): string => {
  const now = new Date();

  const YEAR = now.getFullYear();
  const MONTH = digitAlign(now.getMonth() + 1);
  const DAY = digitAlign(now.getDate());

  // const DAY_OF_WEEK = now.getDay();
  // const WEEK = DAY_OF_WEEK === 0 ? 7 : DAY_OF_WEEK;

  const HOUR = digitAlign(now.getHours());
  // const MINUTE = digitAlign(now.getMinutes());
  // const SECOND = digitAlign(now.getSeconds());

  const DATETIME = `${YEAR}${MONTH}${DAY}${HOUR}${nanoid.Number(3)}`;

  return `${prefix}${DATETIME}${suffix}`;
};
