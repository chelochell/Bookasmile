import { z } from 'zod'

// Base appointment schema for validation
export const appointmentSchema = z.object({
  appointmentId: z.cuid().optional(),
  patientId: z.string('Invalid patient ID'),
  dentistId: z.string('Invalid dentist ID').optional(),
  scheduledBy: z.string('Invalid scheduled by ID'),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid appointment date format'
  }),
  startTime: z.string().refine((time) => !isNaN(Date.parse(time)), {
    message: 'Invalid start time format'
  }),
  endTime: z.string().refine((time) => !isNaN(Date.parse(time)), {
    message: 'Invalid end time format'
  }).optional(),
  notes: z.string().optional(),
  notifContent: z.string().optional(),
  treatmentOptions: z.array(z.string()).optional().default([]),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled']).optional().default('pending'),
  clinicBranchId: z.number().optional(),
  detailedNotes: z.string().optional(),
})

// Schema for creating a new appointment
export const createAppointmentSchema = appointmentSchema.omit({
  appointmentId: true,
})

// Schema for updating an appointment
export const updateAppointmentSchema = appointmentSchema.partial().required({
  appointmentId: true,
})

// Schema for appointment query parameters
export const appointmentQuerySchema = z.object({
  patientId: z.string().optional(),
  dentistId: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date format'
  }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date format'
  }).optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled']).optional(),
  clinicBranchId: z.number().optional(),
  detailedNotes: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
})

// Type exports
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
export type AppointmentQueryParams = z.infer<typeof appointmentQuerySchema>
export type AppointmentData = z.infer<typeof appointmentSchema> 

// Extended type with related data for display purposes
export type AppointmentWithRelations = AppointmentData & {
  patient?: {
    id: string
    name: string
    email: string
  }
  dentist?: {
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  } | null
  scheduledByUser?: {
    id: string
    name: string
    email: string
  }
  clinicBranch?: {
    id: number
    name: string
    address: string
  }
}

export enum AppointmentStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}