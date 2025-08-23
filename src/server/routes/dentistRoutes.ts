import { Hono } from 'hono'
import { AuthType } from '@/auth'
import dentistController from '@/server/controllers/dentist.controller'

const dentistRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
})

// Mount dentist controller at base path
dentistRoutes.route('/', dentistController)

export default dentistRoutes
