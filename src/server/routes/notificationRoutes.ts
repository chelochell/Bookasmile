import { Hono } from 'hono'
import { AuthType } from '@/auth'
import notificationController from '@/server/controllers/notification.controller'

const notificationRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
})

// Mount notification controller at base path
notificationRoutes.route('/', notificationController)

export default notificationRoutes
