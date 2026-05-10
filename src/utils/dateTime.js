import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns'

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatTime = (date) => {
  return format(new Date(date), 'HH:mm')
}

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const getDurationMinutes = (startDate, endDate) => {
  return differenceInMinutes(new Date(endDate), new Date(startDate))
}

export const getDateRange = (days) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  return { start, end }
}
