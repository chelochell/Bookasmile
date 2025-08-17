import { Hono } from 'hono'
import { AuthType } from '@/auth'
import adminController from '@/server/controllers/admin.controller'

const adminRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
})

// Mount admin controller at base path
adminRoutes.route('/', adminController)

export default adminRoutes
