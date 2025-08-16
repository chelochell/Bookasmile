import { Hono } from 'hono'
import { AuthType } from '@/auth'
import testController from '@/server/controllers/test.controller'

const testRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
})

testRoutes.route('/', testController)

export default testRoutes