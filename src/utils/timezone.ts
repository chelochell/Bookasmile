import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// Philippine timezone constant
export const PHILIPPINE_TIMEZONE = 'Asia/Manila'

/**
 * Convert a date/time to UTC for storage in database
 */
export function toUTC(date: string | Date): string {
  return dayjs(date).utc().toISOString()
}

/**
 * Convert a UTC date/time to Philippine time for display
 */
export function toPhilippineTime(utcDate: string | Date): dayjs.Dayjs {
  return dayjs(utcDate).tz(PHILIPPINE_TIMEZONE)
}

/**
 * Create a datetime string from date and time for Philippine timezone
 */
export function createPhilippineDatetime(date: Date, time: string): string {
  // Get the date components directly from the Date object to avoid timezone shifts
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  // Combine date and time in Philippine timezone
  const datetime = dayjs.tz(`${dateStr} ${time}`, PHILIPPINE_TIMEZONE)
  
  // Return as UTC ISO string for storage
  return datetime.utc().toISOString()
}

/**
 * Format a UTC datetime for display in Philippine time
 */
export function formatPhilippineTime(utcDate: string | Date, format = 'HH:mm'): string {
  return toPhilippineTime(utcDate).format(format)
}

/**
 * Format a UTC datetime for display in Philippine date
 */
export function formatPhilippineDate(utcDate: string | Date, format = 'YYYY-MM-DD'): string {
  return toPhilippineTime(utcDate).format(format)
}

/**
 * Format a UTC datetime for full display in Philippine time
 */
export function formatPhilippineDateTime(utcDate: string | Date, format = 'YYYY-MM-DD HH:mm'): string {
  return toPhilippineTime(utcDate).format(format)
}

/**
 * Get current Philippine time
 */
export function nowInPhilippines(): dayjs.Dayjs {
  return dayjs().tz(PHILIPPINE_TIMEZONE)
}

/**
 * Check if a date is today in Philippine timezone
 */
export function isToday(date: string | Date): boolean {
  const today = nowInPhilippines().format('YYYY-MM-DD')
  const checkDate = toPhilippineTime(date).format('YYYY-MM-DD')
  return today === checkDate
}

/**
 * Debug function to log timezone conversions
 */
export function debugTimezone(label: string, date: Date, time: string) {
  console.log(`=== ${label} ===`)
  console.log('Input date:', date)
  console.log('Input time:', time)
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  console.log('Extracted date string:', dateStr)
  
  const datetime = dayjs.tz(`${dateStr} ${time}`, PHILIPPINE_TIMEZONE)
  console.log('Philippine datetime:', datetime.format('YYYY-MM-DD HH:mm:ss Z'))
  
  const utc = datetime.utc().toISOString()
  console.log('UTC ISO string:', utc)
  
  const backToPhilippines = toPhilippineTime(utc)
  console.log('Back to Philippines:', backToPhilippines.format('YYYY-MM-DD HH:mm:ss Z'))
  
  return utc
}
