import { z } from 'zod'

// Base notification schema for validation
export const notificationSchema = z.object({
  id: z.string().cuid().optional(),
  userId: z.string('Invalid user ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  type: z.enum(['info', 'success', 'warning', 'error']).optional().default('info'),
  isRead: z.boolean().optional().default(false),
  appointmentId: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// Schema for creating a new notification
export const createNotificationSchema = notificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  isRead: true, // Make isRead optional for creation since it has a default
})

// Schema for updating a notification
export const updateNotificationSchema = notificationSchema.partial().required({
  id: true,
})

// Schema for notification query parameters
export const notificationQuerySchema = z.object({
  userId: z.string().optional(),
  isRead: z.boolean().optional(),
  type: z.enum(['info', 'success', 'warning', 'error']).optional(),
  appointmentId: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
})

// Schema for marking notifications as read
export const markAsReadSchema = z.object({
  notificationIds: z.array(z.string().cuid()),
})

// Type exports
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>
export type NotificationQueryParams = z.infer<typeof notificationQuerySchema>
export type NotificationData = z.infer<typeof notificationSchema>
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>

export enum NotificationTypeEnum {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

// Extended type with related data for display purposes
export type NotificationWithRelations = NotificationData & {
  user?: {
    id: string
    name: string
    email: string
  }
  appointment?: {
    appointmentId: string
    appointmentDate: Date
    startTime: Date
    status: string
  }
}
