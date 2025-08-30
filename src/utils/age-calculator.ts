import dayjs from 'dayjs'

/**
 * Calculate age based on birth date
 * @param birthDate - Date of birth (string or Date object)
 * @returns Age in years as a number
 */
export function calculateAge(birthDate: string | Date): number {
  const birth = dayjs(birthDate)
  const today = dayjs()
  
  // Check if the birth date is valid
  if (!birth.isValid()) {
    throw new Error('Invalid birth date')
  }
  
  // Check if birth date is in the future
  if (birth.isAfter(today)) {
    throw new Error('Birth date cannot be in the future')
  }
  
  return today.diff(birth, 'year')
}

/**
 * Calculate age with detailed breakdown
 * @param birthDate - Date of birth (string or Date object)
 * @returns Object with years, months, and days
 */
export function calculateDetailedAge(birthDate: string | Date): {
  years: number
  months: number
  days: number
} {
  const birth = dayjs(birthDate)
  const today = dayjs()
  
  if (!birth.isValid()) {
    throw new Error('Invalid birth date')
  }
  
  if (birth.isAfter(today)) {
    throw new Error('Birth date cannot be in the future')
  }
  
  const years = today.diff(birth, 'year')
  const months = today.diff(birth.add(years, 'year'), 'month')
  const days = today.diff(birth.add(years, 'year').add(months, 'month'), 'day')
  
  return { years, months, days }
}

/**
 * Format age as a readable string
 * @param birthDate - Date of birth (string or Date object)
 * @param format - Format type: 'simple' (just years) or 'detailed' (years, months, days)
 * @returns Formatted age string
 */
export function formatAge(birthDate: string | Date, format: 'simple' | 'detailed' = 'simple'): string {
  if (format === 'simple') {
    const age = calculateAge(birthDate)
    return `${age} year${age !== 1 ? 's' : ''} old`
  }
  
  const { years, months, days } = calculateDetailedAge(birthDate)
  
  const parts: string[] = []
  
  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? 's' : ''}`)
  }
  
  if (months > 0) {
    parts.push(`${months} month${months !== 1 ? 's' : ''}`)
  }
  
  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`)
  }
  
  if (parts.length === 0) {
    return 'Born today'
  }
  
  if (parts.length === 1) {
    return `${parts[0]} old`
  }
  
  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]} old`
  }
  
  return `${parts[0]}, ${parts[1]} and ${parts[2]} old`
}

/**
 * Check if a person is of a certain age or older
 * @param birthDate - Date of birth (string or Date object)
 * @param minimumAge - Minimum age to check against
 * @returns Boolean indicating if person meets minimum age requirement
 */
export function isAgeAtLeast(birthDate: string | Date, minimumAge: number): boolean {
  const age = calculateAge(birthDate)
  return age >= minimumAge
}

/**
 * Get age category based on birth date
 * @param birthDate - Date of birth (string or Date object)
 * @returns Age category string
 */
export function getAgeCategory(birthDate: string | Date): string {
  const age = calculateAge(birthDate)
  
  if (age < 1) return 'Infant'
  if (age < 3) return 'Toddler'
  if (age < 13) return 'Child'
  if (age < 20) return 'Teenager'
  if (age < 60) return 'Adult'
  return 'Senior'
}
