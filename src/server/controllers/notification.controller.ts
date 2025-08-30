import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { NotificationService } from '@/server/services/notification.service'
import { CreateNotificationInput, UpdateNotificationInput, MarkAsReadInput } from '@/server/models/notification.model'
import { getServerSession } from '@/actions/get-server-session'

const notificationController = new Hono<{ Variables: AuthType }>({
  strict: false,
})

/**
 * Create a new notification
 * POST /notifications
 */
notificationController.post('/', async (c) => {
  try {
    const body = await c.req.json()
    
    const input: CreateNotificationInput = {
      userId: body.userId,
      title: body.title,
      message: body.message,
      type: body.type,
      appointmentId: body.appointmentId,
    }

    const result = await NotificationService.createNotification(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      201
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Invalid request body', 
        message: 'Failed to create notification' 
      }, 
      400
    )
  }
})

/**
 * Get all notifications with optional filtering
 * GET /notifications
 */
notificationController.get('/', async (c) => {
  try {
    const query = c.req.query()
    const result = await NotificationService.getNotifications(query)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Invalid query parameters', 
        message: 'Failed to get notifications' 
      }, 
      400
    )
  }
})

/**
 * Get notifications for current user
 * GET /notifications/me
 */
notificationController.get('/me', async (c) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const query = c.req.query()
    const result = await NotificationService.getNotifications({
      ...query,
      userId: session.user.id
    })
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to get user notifications', 
        message: 'An error occurred while getting notifications' 
      }, 
      500
    )
  }
})

/**
 * Get unread count for current user
 * GET /notifications/me/unread-count
 */
notificationController.get('/me/unread-count', async (c) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const result = await NotificationService.getUnreadCount(session.user.id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to get unread count', 
        message: 'An error occurred while getting unread count' 
      }, 
      500
    )
  }
})

/**
 * Get notification by ID
 * GET /notifications/:id
 */
notificationController.get('/:id', async (c) => {
  try {
    const notificationId = c.req.param('id')
    
    if (!notificationId) {
      return c.json(
        { 
          success: false, 
          error: 'Missing notification ID', 
          message: 'Notification ID is required' 
        }, 
        400
      )
    }

    const result = await NotificationService.getNotificationById(notificationId)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Notification not found' ? 404 : 400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to retrieve notification', 
        message: 'An error occurred while getting the notification' 
      }, 
      500
    )
  }
})

/**
 * Update a notification
 * PUT /notifications/:id
 */
notificationController.put('/:id', async (c) => {
  try {
    const notificationId = c.req.param('id')
    const body = await c.req.json()
    
    if (!notificationId) {
      return c.json(
        { 
          success: false, 
          error: 'Missing notification ID', 
          message: 'Notification ID is required' 
        }, 
        400
      )
    }

    const input: UpdateNotificationInput = {
      id: notificationId,
      title: body.title,
      message: body.message,
      type: body.type,
      isRead: body.isRead,
      appointmentId: body.appointmentId,
    }

    const result = await NotificationService.updateNotification(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Notification not found' ? 404 : 400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Invalid request body', 
        message: 'Failed to update notification' 
      }, 
      400
    )
  }
})

/**
 * Mark notifications as read
 * PATCH /notifications/mark-read
 */
notificationController.patch('/mark-read', async (c) => {
  try {
    const body = await c.req.json()
    
    const input: MarkAsReadInput = {
      notificationIds: body.notificationIds,
    }

    const result = await NotificationService.markAsRead(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to mark as read', 
        message: 'An error occurred while marking notifications as read' 
      }, 
      500
    )
  }
})

/**
 * Mark all notifications as read for current user
 * PATCH /notifications/me/mark-all-read
 */
notificationController.patch('/me/mark-all-read', async (c) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const result = await NotificationService.markAllAsRead(session.user.id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to mark all as read', 
        message: 'An error occurred while marking all notifications as read' 
      }, 
      500
    )
  }
})

/**
 * Delete a notification
 * DELETE /notifications/:id
 */
notificationController.delete('/:id', async (c) => {
  try {
    const notificationId = c.req.param('id')
    
    if (!notificationId) {
      return c.json(
        { 
          success: false, 
          error: 'Missing notification ID', 
          message: 'Notification ID is required' 
        }, 
        400
      )
    }

    const result = await NotificationService.deleteNotification(notificationId)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Notification not found' ? 404 : 400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to delete notification', 
        message: 'An error occurred while deleting the notification' 
      }, 
      500
    )
  }
})

export default notificationController
