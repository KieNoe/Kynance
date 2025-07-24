import dayjs from 'dayjs';

/**
 * 生成固定时间范围的时间数组
 * @param {[string, string]} dateRange - 时间范围
 * @returns {string[]} 时间数组
 */
export function generateFixedDates(dateRange) {
  const [start, end] = dateRange;
  const isIntraday = start.includes(' ') && end.includes(' ');
  const result = [];

  let format, unit, step;
  if (isIntraday) {
    format = 'YYYY-MM-DD HH:mm';
    unit = 'minute';
    step = 5;
  } else {
    format = 'YYYY-MM-DD';
    unit = 'day';
    step = 1;
  }

  let current = dayjs(start);
  const endDate = dayjs(end);

  while (current.isBefore(endDate) || current.isSame(endDate)) {
    result.push(current.format(format));
    current = current.add(step, unit);
  }
  return result;
}
