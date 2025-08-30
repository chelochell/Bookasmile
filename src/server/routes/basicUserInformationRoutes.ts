import { Hono } from 'hono'
import { AuthType } from '@/auth'
import basicUserInformationController from '@/server/controllers/basic-user-information.controller'

const basicUserInformationRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
})

// Mount basic user information controller at base path
basicUserInformationRoutes.route('/', basicUserInformationController)

export default basicUserInformationRoutes
