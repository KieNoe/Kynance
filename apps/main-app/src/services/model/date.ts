import dayjs from 'dayjs'
export const LAST_1_DAYS = [
  dayjs().startOf('day').add(9, 'hour').add(30, 'minute').format('YYYY-MM-DD HH:mm'),
  dayjs().format('YYYY-MM-DD HH:mm'),
]
export const LAST_30_DAYS = [
  dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
export const LAST_10_DAYS = [
  dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
export const LAST_5_DAYS = [
  dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
export const LAST_7_DAYS = [
  dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
export const LAST_180_DAYS = [
  dayjs().subtract(180, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
export const LAST_365_DAYS = [
  dayjs().subtract(365, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
