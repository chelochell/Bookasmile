import { z } from 'zod'

// Common validation patterns
const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
const dayOfWeekEnum = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

// DentistAvailability schema
export const dentistAvailabilitySchema = z.object({
  id: z.cuid().optional(),
  dentistId: z.string('Invalid dentist ID'),
  standardStartTime: z.string().regex(timePattern, 'Invalid time format (HH:MM expected)'),
  standardEndTime: z.string().regex(timePattern, 'Invalid time format (HH:MM expected)'),
  breakStartTime: z.string().regex(timePattern, 'Invalid time format (HH:MM expected)').optional(),
  breakEndTime: z.string().regex(timePattern, 'Invalid time format (HH:MM expected)').optional(),
  dayOfWeek: z.enum(dayOfWeekEnum, {
    message: 'Invalid day of week'
  }),
  clinicBranchId: z.number().int().positive('Invalid clinic branch ID'),
}).refine((data) => {
  // Validate start time is before end time
  const [startHour, startMin] = data.standardStartTime.split(':').map(Number)
  const [endHour, endMin] = data.standardEndTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  return startMinutes < endMinutes
}, {
  message: 'Standard end time must be after start time',
  path: ['standardEndTime']
}).refine((data) => {
  // Validate break times if provided
  if (data.breakStartTime && data.breakEndTime) {
    const [breakStartHour, breakStartMin] = data.breakStartTime.split(':').map(Number)
    const [breakEndHour, breakEndMin] = data.breakEndTime.split(':').map(Number)
    const breakStartMinutes = breakStartHour * 60 + breakStartMin
    const breakEndMinutes = breakEndHour * 60 + breakEndMin
    return breakStartMinutes < breakEndMinutes
  }
  return true
}, {
  message: 'Break end time must be after break start time',
  path: ['breakEndTime']
}).refine((data) => {
  // Validate break times are within working hours
  if (data.breakStartTime && data.breakEndTime) {
    const [startHour, startMin] = data.standardStartTime.split(':').map(Number)
    const [endHour, endMin] = data.standardEndTime.split(':').map(Number)
    const [breakStartHour, breakStartMin] = data.breakStartTime.split(':').map(Number)
    const [breakEndHour, breakEndMin] = data.breakEndTime.split(':').map(Number)
    
    const workStartMinutes = startHour * 60 + startMin
    const workEndMinutes = endHour * 60 + endMin
    const breakStartMinutes = breakStartHour * 60 + breakStartMin
    const breakEndMinutes = breakEndHour * 60 + breakEndMin
    
    return breakStartMinutes >= workStartMinutes && breakEndMinutes <= workEndMinutes
  }
  return true
}, {
  message: 'Break times must be within working hours',
  path: ['breakStartTime']
})

// SpecificDentistAvailability schema
export const specificDentistAvailabilitySchema = z.object({
  id: z.cuid().optional(),
  dentistId: z.string('Invalid dentist ID'),
  startDateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date time format'
  }),
  endDateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date time format'
  }),
  clinicBranchId: z.number().int().positive('Invalid clinic branch ID').optional(),
}).refine((data) => {
  // Validate start time is before end time
  const startDate = new Date(data.startDateTime)
  const endDate = new Date(data.endDateTime)
  return startDate < endDate
}, {
  message: 'End date time must be after start date time',
  path: ['endDateTime']
})

// DentistLeaves schema
export const dentistLeavesSchema = z.object({
  id: z.cuid().optional(),
  dentistId: z.string('Invalid dentist ID'),
  startDateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date time format'
  }),
  endDateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date time format'
  }),
}).refine((data) => {
  // Validate start time is before end time
  const startDate = new Date(data.startDateTime)
  const endDate = new Date(data.endDateTime)
  return startDate < endDate
}, {
  message: 'End date time must be after start date time',
  path: ['endDateTime']
})

// Schemas for creating new records
export const createDentistAvailabilitySchema = dentistAvailabilitySchema.omit({
  id: true,
})

export const createSpecificDentistAvailabilitySchema = specificDentistAvailabilitySchema.omit({
  id: true,
})

export const createDentistLeavesSchema = dentistLeavesSchema.omit({
  id: true,
})

// Schemas for updating records
export const updateDentistAvailabilitySchema = dentistAvailabilitySchema.partial().required({
  id: true,
})

export const updateSpecificDentistAvailabilitySchema = specificDentistAvailabilitySchema.partial().required({
  id: true,
})

export const updateDentistLeavesSchema = dentistLeavesSchema.partial().required({
  id: true,
})

// Query schemas for filtering
export const dentistAvailabilityQuerySchema = z.object({
  dentistId: z.string().optional(),
  dayOfWeek: z.enum(dayOfWeekEnum).optional(),
  clinicBranchId: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
})

export const specificDentistAvailabilityQuerySchema = z.object({
  dentistId: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date format'
  }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date format'
  }).optional(),
  clinicBranchId: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
})

export const dentistLeavesQuerySchema = z.object({
  dentistId: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date format'
  }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date format'
  }).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
})

// Type exports
export type DentistAvailabilityData = z.infer<typeof dentistAvailabilitySchema>
export type CreateDentistAvailabilityInput = z.infer<typeof createDentistAvailabilitySchema>
export type UpdateDentistAvailabilityInput = z.infer<typeof updateDentistAvailabilitySchema>
export type DentistAvailabilityQueryParams = z.infer<typeof dentistAvailabilityQuerySchema>

export type SpecificDentistAvailabilityData = z.infer<typeof specificDentistAvailabilitySchema>
export type CreateSpecificDentistAvailabilityInput = z.infer<typeof createSpecificDentistAvailabilitySchema>
export type UpdateSpecificDentistAvailabilityInput = z.infer<typeof updateSpecificDentistAvailabilitySchema>
export type SpecificDentistAvailabilityQueryParams = z.infer<typeof specificDentistAvailabilityQuerySchema>

export type DentistLeavesData = z.infer<typeof dentistLeavesSchema>
export type CreateDentistLeavesInput = z.infer<typeof createDentistLeavesSchema>
export type UpdateDentistLeavesInput = z.infer<typeof updateDentistLeavesSchema>
export type DentistLeavesQueryParams = z.infer<typeof dentistLeavesQuerySchema>

// Enums
export enum DayOfWeekEnum {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}
