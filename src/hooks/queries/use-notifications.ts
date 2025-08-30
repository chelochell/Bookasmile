'use client'

import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api/notifications'
import { NotificationQueryParams } from '@/server/models/notification.model'

/**
 * Hook to fetch all notifications with filtering
 */
export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch notifications for current user
 */
export function useUserNotifications(params?: Omit<NotificationQueryParams, 'userId'>) {
  return useQuery({
    queryKey: ['notifications', 'user', params],
    queryFn: () => notificationsApi.getUserNotifications(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch unread notification count for current user
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  })
}

/**
 * Hook to fetch a specific notification by ID
 */
export function useNotification(notificationId: string | null) {
  return useQuery({
    queryKey: ['notifications', notificationId],
    queryFn: () => notificationsApi.getNotificationById(notificationId!),
    enabled: !!notificationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch only unread notifications for current user
 */
export function useUnreadNotifications(params?: Omit<NotificationQueryParams, 'userId' | 'isRead'>) {
  return useQuery({
    queryKey: ['notifications', 'user', 'unread', params],
    queryFn: () => notificationsApi.getUserNotifications({ ...params, isRead: false }),
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

/**
 * Hook to fetch only read notifications for current user
 */
export function useReadNotifications(params?: Omit<NotificationQueryParams, 'userId' | 'isRead'>) {
  return useQuery({
    queryKey: ['notifications', 'user', 'read', params],
    queryFn: () => notificationsApi.getUserNotifications({ ...params, isRead: true }),
    staleTime: 1000 * 60 * 10, // 10 minutes (read notifications change less frequently)
  })
}
