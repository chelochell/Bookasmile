import { Hono } from 'hono'
import { AuthType } from '@/auth'
import appointmentController from '@/server/controllers/appointment.controller'

const appointmentRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
})

// Mount appointment controller at base path
appointmentRoutes.route('/', appointmentController)

export default appointmentRoutes 