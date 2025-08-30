import { prisma } from '@/lib/prisma'
import { 
  createNotificationSchema, 
  updateNotificationSchema,
  notificationQuerySchema,
  markAsReadSchema,
  CreateNotificationInput,
  UpdateNotificationInput,
  NotificationQueryParams,
  MarkAsReadInput
} from '@/server/models/notification.model'

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(input: CreateNotificationInput) {
    try {
      const validatedInput = createNotificationSchema.parse(input)
      
      const notification = await prisma.notification.create({
        data: {
          userId: validatedInput.userId,
          title: validatedInput.title,
          message: validatedInput.message,
          type: validatedInput.type || 'info',
          appointmentId: validatedInput.appointmentId || null,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          appointment: {
            select: {
              appointmentId: true,
              appointmentDate: true,
              startTime: true,
              status: true,
            }
          }
        }
      })

      return {
        success: true,
        data: notification,
        message: 'Notification created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create notification',
        message: 'Notification creation failed'
      }
    }
  }

  /**
   * Get notification by ID
   */
  static async getNotificationById(notificationId: string) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        include: {
          user: { select: { id: true, name: true, email: true } },
          appointment: {
            select: {
              appointmentId: true,
              appointmentDate: true,
              startTime: true,
              status: true,
            }
          }
        }
      })

      if (!notification) {
        return {
          success: false,
          error: 'Notification not found',
          message: 'No notification found with this ID'
        }
      }

      return {
        success: true,
        data: notification,
        message: 'Notification retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve notification',
        message: 'Failed to get notification'
      }
    }
  }

  /**
   * Get notifications with optional filtering and pagination
   */
  static async getNotifications(params: NotificationQueryParams) {
    try {
      const validatedParams = notificationQuerySchema.parse(params)
      
      const where: any = {}
      
      if (validatedParams.userId) {
        where.userId = validatedParams.userId
      }
      
      if (validatedParams.isRead !== undefined) {
        where.isRead = validatedParams.isRead
      }
      
      if (validatedParams.type) {
        where.type = validatedParams.type
      }
      
      if (validatedParams.appointmentId) {
        where.appointmentId = validatedParams.appointmentId
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, email: true } },
            appointment: {
              select: {
                appointmentId: true,
                appointmentDate: true,
                startTime: true,
                status: true,
              }
            }
          },
          orderBy: [
            { createdAt: 'desc' }
          ],
          take: validatedParams.limit || 50,
          skip: validatedParams.offset || 0,
        }),
        prisma.notification.count({ where })
      ])

      return {
        success: true,
        data: {
          notifications,
          pagination: {
            total,
            limit: validatedParams.limit || 50,
            offset: validatedParams.offset || 0,
            hasMore: (validatedParams.offset || 0) + notifications.length < total
          }
        },
        message: 'Notifications retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve notifications',
        message: 'Failed to get notifications'
      }
    }
  }

  /**
   * Update a notification
   */
  static async updateNotification(input: UpdateNotificationInput) {
    try {
      const validatedInput = updateNotificationSchema.parse(input)
      
      // Check if notification exists
      const existingNotification = await prisma.notification.findUnique({
        where: { id: validatedInput.id }
      })

      if (!existingNotification) {
        return {
          success: false,
          error: 'Notification not found',
          message: 'No notification found with this ID'
        }
      }

      const updateData: any = {}
      
      if (validatedInput.title !== undefined) updateData.title = validatedInput.title
      if (validatedInput.message !== undefined) updateData.message = validatedInput.message
      if (validatedInput.type !== undefined) updateData.type = validatedInput.type
      if (validatedInput.isRead !== undefined) updateData.isRead = validatedInput.isRead
      if (validatedInput.appointmentId !== undefined) updateData.appointmentId = validatedInput.appointmentId

      const notification = await prisma.notification.update({
        where: { id: validatedInput.id },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, email: true } },
          appointment: {
            select: {
              appointmentId: true,
              appointmentDate: true,
              startTime: true,
              status: true,
            }
          }
        }
      })

      return {
        success: true,
        data: notification,
        message: 'Notification updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update notification',
        message: 'Notification update failed'
      }
    }
  }

  /**
   * Mark notifications as read
   */
  static async markAsRead(input: MarkAsReadInput) {
    try {
      const validatedInput = markAsReadSchema.parse(input)
      
      const result = await prisma.notification.updateMany({
        where: {
          id: {
            in: validatedInput.notificationIds
          }
        },
        data: {
          isRead: true
        }
      })

      return {
        success: true,
        data: { updatedCount: result.count },
        message: `${result.count} notification(s) marked as read`
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to mark notifications as read',
        message: 'Mark as read failed'
      }
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false
        },
        data: {
          isRead: true
        }
      })

      return {
        success: true,
        data: { updatedCount: result.count },
        message: `${result.count} notification(s) marked as read`
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to mark all notifications as read',
        message: 'Mark all as read failed'
      }
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string) {
    try {
      // Check if notification exists
      const existingNotification = await prisma.notification.findUnique({
        where: { id: notificationId }
      })

      if (!existingNotification) {
        return {
          success: false,
          error: 'Notification not found',
          message: 'No notification found with this ID'
        }
      }

      await prisma.notification.delete({
        where: { id: notificationId }
      })

      return {
        success: true,
        data: { id: notificationId },
        message: 'Notification deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete notification',
        message: 'Notification deletion failed'
      }
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      })

      return {
        success: true,
        data: { count },
        message: 'Unread count retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get unread count',
        message: 'Failed to get unread count'
      }
    }
  }
}
