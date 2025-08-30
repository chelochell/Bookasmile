import { CreateNotificationInput, UpdateNotificationInput, NotificationQueryParams, MarkAsReadInput } from '@/server/models/notification.model'

const BASE_URL = '/api/notifications'

// API client functions for notifications
export const notificationsApi = {
  /**
   * Create a new notification
   */
  async createNotification(input: CreateNotificationInput) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create notification')
    }

    return response.json()
  },

  /**
   * Get all notifications with filtering
   */
  async getNotifications(params?: NotificationQueryParams) {
    const searchParams = new URLSearchParams()
    
    if (params?.userId) searchParams.set('userId', params.userId)
    if (params?.isRead !== undefined) searchParams.set('isRead', params.isRead.toString())
    if (params?.type) searchParams.set('type', params.type)
    if (params?.appointmentId) searchParams.set('appointmentId', params.appointmentId)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())

    const url = searchParams.toString() ? `${BASE_URL}?${searchParams.toString()}` : BASE_URL

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch notifications')
    }

    return response.json()
  },

  /**
   * Get notifications for current user
   */
  async getUserNotifications(params?: Omit<NotificationQueryParams, 'userId'>) {
    const searchParams = new URLSearchParams()
    
    if (params?.isRead !== undefined) searchParams.set('isRead', params.isRead.toString())
    if (params?.type) searchParams.set('type', params.type)
    if (params?.appointmentId) searchParams.set('appointmentId', params.appointmentId)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())

    const url = searchParams.toString() ? `${BASE_URL}/me?${searchParams.toString()}` : `${BASE_URL}/me`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch user notifications')
    }

    return response.json()
  },

  /**
   * Get unread notification count for current user
   */
  async getUnreadCount() {
    const response = await fetch(`${BASE_URL}/me/unread-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch unread count')
    }

    return response.json()
  },

  /**
   * Get notification by ID
   */
  async getNotificationById(notificationId: string) {
    const response = await fetch(`${BASE_URL}/${notificationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch notification')
    }

    return response.json()
  },

  /**
   * Update a notification
   */
  async updateNotification(input: UpdateNotificationInput) {
    const response = await fetch(`${BASE_URL}/${input.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update notification')
    }

    return response.json()
  },

  /**
   * Mark notifications as read
   */
  async markAsRead(input: MarkAsReadInput) {
    const response = await fetch(`${BASE_URL}/mark-read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to mark notifications as read')
    }

    return response.json()
  },

  /**
   * Mark all notifications as read for current user
   */
  async markAllAsRead() {
    const response = await fetch(`${BASE_URL}/me/mark-all-read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to mark all notifications as read')
    }

    return response.json()
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string) {
    const response = await fetch(`${BASE_URL}/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete notification')
    }

    return response.json()
  },
}
