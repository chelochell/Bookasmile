'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationsApi } from '@/lib/api/notifications'
import { CreateNotificationInput, UpdateNotificationInput, MarkAsReadInput } from '@/server/models/notification.model'

/**
 * Hook to create a new notification
 */
export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateNotificationInput) => notificationsApi.createNotification(input),
    onSuccess: (data) => {
      // Invalidate and refetch notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success(data.message || 'Notification created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create notification')
    },
  })
}

/**
 * Hook to update a notification
 */
export function useUpdateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateNotificationInput) => notificationsApi.updateNotification(input),
    onSuccess: (data) => {
      // Invalidate and refetch notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success(data.message || 'Notification updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update notification')
    },
  })
}

/**
 * Hook to mark specific notifications as read
 */
export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: MarkAsReadInput) => notificationsApi.markAsRead(input),
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      // Get current data
      const previousData = queryClient.getQueryData(['notifications'])

      // Optimistically update notifications to read state
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
        if (!old?.data?.notifications) return old

        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((notification: any) =>
              input.notificationIds.includes(notification.id)
                ? { ...notification, isRead: true }
                : notification
            )
          }
        }
      })

      // Update unread count
      queryClient.setQueryData(['notifications', 'unread-count'], (old: any) => {
        if (!old?.data?.count) return old
        const newCount = Math.max(0, old.data.count - input.notificationIds.length)
        return {
          ...old,
          data: { count: newCount }
        }
      })

      return { previousData }
    },
    onError: (error: Error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData)
      }
      toast.error(error.message || 'Failed to mark notifications as read')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Notifications marked as read')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook to mark all notifications as read for current user
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      // Get current data
      const previousData = queryClient.getQueryData(['notifications'])

      // Optimistically mark all notifications as read
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
        if (!old?.data?.notifications) return old

        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((notification: any) => ({
              ...notification,
              isRead: true
            }))
          }
        }
      })

      // Reset unread count to 0
      queryClient.setQueryData(['notifications', 'unread-count'], (old: any) => ({
        ...old,
        data: { count: 0 }
      }))

      return { previousData }
    },
    onError: (error: Error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData)
      }
      toast.error(error.message || 'Failed to mark all notifications as read')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'All notifications marked as read')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      // Get current data
      const previousData = queryClient.getQueryData(['notifications'])

      // Optimistically remove notification
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
        if (!old?.data?.notifications) return old

        const filteredNotifications = old.data.notifications.filter(
          (notification: any) => notification.id !== notificationId
        )

        return {
          ...old,
          data: {
            ...old.data,
            notifications: filteredNotifications
          }
        }
      })

      return { previousData }
    },
    onError: (error: Error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData)
      }
      toast.error(error.message || 'Failed to delete notification')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Notification deleted successfully')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
