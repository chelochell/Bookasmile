import { Hono } from 'hono'
import { AuthType } from '@/auth'
import availabilityController from '@/server/controllers/availability.controller'

const availabilityRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
})

// Mount availability controller at base path
availabilityRoutes.route('/', availabilityController)

export default availabilityRoutes
