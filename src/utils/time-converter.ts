import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Converts UTC time to Philippine time (Asia/Manila)
 * 
 * @param utcTime - UTC time string or Date object (e.g. "2025-08-22T02:00:00.000Z")
 * @param format - Optional output format (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted Philippine time string
 * 
 * @example
 * // Returns "2025-08-22 10:00:00" (PHT is UTC+8)
 * utcToPhilippineTime("2025-08-22T02:00:00.000Z")
 */
export const utcToPhilippineTime = (
  utcTime: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return dayjs(utcTime)
    .tz('Asia/Manila')
    .format(format);
};

/**
 * Gets the current time in Philippine timezone
 * 
 * @param format - Optional output format (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Current Philippine time as formatted string
 */
export const getCurrentPhilippineTime = (
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return dayjs().tz('Asia/Manila').format(format);
};

