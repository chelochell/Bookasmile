'use client'

import { useState, useMemo } from 'react'
import { Bell, Check, CheckCheck, Trash2, Filter, Search, Calendar, Clock, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserNotifications, useUnreadNotificationCount } from '@/hooks/queries/use-notifications'
import { useMarkNotificationsAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from '@/hooks/mutations/use-notification-mutations'
import { NotificationWithRelations } from '@/server/models/notification.model'
import { formatPhilippineDateTime } from '@/utils/timezone'
import { Separator } from '@/components/ui/separator'

interface NotificationsPageProps {
  userId: string
}

export default function NotificationsPage({ userId }: NotificationsPageProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  // Fetch notifications data
  const { 
    data: notificationsData, 
    isLoading, 
    isError, 
    error 
  } = useUserNotifications({ limit: 100 })

  const { data: unreadCountData } = useUnreadNotificationCount()

  // Mutations
  const markAsReadMutation = useMarkNotificationsAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()
  const deleteNotificationMutation = useDeleteNotification()

  const notifications = notificationsData?.data?.notifications || []
  const unreadCount = unreadCountData?.data?.count || 0

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification: NotificationWithRelations) => {
      const matchesSearch = search === '' || 
        notification.title?.toLowerCase().includes(search.toLowerCase()) ||
        notification.message?.toLowerCase().includes(search.toLowerCase())
      
      const matchesType = typeFilter === 'all' || notification.type === typeFilter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'read' && notification.isRead) ||
        (statusFilter === 'unread' && !notification.isRead)
      
      return matchesSearch && matchesType && matchesStatus
    })
  }, [notifications, search, typeFilter, statusFilter])

  // Handler functions
  const handleMarkAsRead = (notificationIds: string[]) => {
    markAsReadMutation.mutate({ notificationIds })
    setSelectedNotifications([])
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId)
  }

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    const unreadNotifications = filteredNotifications.filter((n: NotificationWithRelations) => !n.isRead)
    setSelectedNotifications(
      unreadNotifications.length === selectedNotifications.length 
        ? []
        : unreadNotifications.map((n: NotificationWithRelations) => n.id!)
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Notifications Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load notifications</h2>
            <p className="text-gray-600 mb-4">
              {error?.message || 'An error occurred while loading your notifications.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'You\'re all caught up!'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {selectedNotifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkAsRead(selectedNotifications)}
                disabled={markAsReadMutation.isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Selected as Read
              </Button>
            )}
            
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              {filteredNotifications.filter((n: NotificationWithRelations) => !n.isRead).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedNotifications.length === filteredNotifications.filter((n: NotificationWithRelations) => !n.isRead).length 
                    ? 'Deselect All' 
                    : 'Select All Unread'
                  }
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {search || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more notifications.'
                  : 'You don\'t have any notifications yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification: NotificationWithRelations) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                } ${
                  selectedNotifications.includes(notification.id!) ? 'ring-2 ring-primary ring-opacity-50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Selection Checkbox for unread notifications */}
                    {!notification.isRead && (
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id!)}
                        onChange={() => handleSelectNotification(notification.id!)}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    )}

                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type || 'info')}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs capitalize ${getNotificationTypeColor(notification.type || 'info')}`}
                            >
                              {notification.type || 'info'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatPhilippineDateTime(notification.createdAt!)}
                            </div>
                            
                            {notification.appointment && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Appointment Related
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead([notification.id!])}
                              disabled={markAsReadMutation.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id!)}
                            disabled={deleteNotificationMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
