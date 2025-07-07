import dayjs from 'dayjs'

import { useUserStore } from '@/stores'

const userStore = useUserStore()

export const getDiffDays = () => {
  if (!userStore.user.createdData) {
    return 1
  }
  const current = dayjs().format('YYYY-MM-DD')
  const prev = dayjs(userStore.user.createdData).format('YYYY-MM-DD')
  return dayjs(current).diff(prev, 'day')
}

export const getDatePeriod = () => {
  const hour = dayjs().hour()
  if (3 <= hour && hour < 12) {
    return 'morning'
  } else if (12 <= hour && hour < 18) {
    return 'afternoon'
  } else {
    return 'evening'
  }
}
export const LAST_30_DAYS = [
  dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
export const LAST_7_DAYS = [
  dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
]
