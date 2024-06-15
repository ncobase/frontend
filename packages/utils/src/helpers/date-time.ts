import { format, isValid } from 'date-fns';

type DateFormatType = 'year' | 'month' | 'day' | 'date' | 'time' | 'dateTime';

const getFormatPattern = (type: DateFormatType) => {
  switch (type) {
    case 'year':
      return 'yyyy';
    case 'month':
      return 'MM';
    case 'day':
      return 'dd';
    case 'date':
      return 'yyyy-MM-dd';
    case 'time':
      return 'HH:mm:ss';
    case 'dateTime':
      return 'yyyy-MM-dd HH:mm:ss';
  }
};

/**
 * 格式化日期、时间
 * @param dateTime 日期时间
 * @param type 格式化类型，默认 dateTime，可选值为 'year' | 'month' | 'day' | 'date' | 'time' | 'dateTime'
 * @returns 格式化后的日期/时间字符串
 */
export const formatDateTime = (
  dateTime?: string | Date,
  type: DateFormatType = 'dateTime'
): string | null => {
  if (!dateTime) return null;

  const parseDate = new Date(dateTime);
  if (!isValid(parseDate)) return null;

  const pattern = getFormatPattern(type);
  return format(parseDate, pattern);
};
