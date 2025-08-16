import { Hono } from 'hono'
import { AuthType } from '@/auth'

const testController = new Hono({
  strict: false,
})

testController.get('/test', (c) => {
  return c.json({ 
    message: 'Test controller is working!',
    timestamp: new Date().toISOString()
  })
})

testController.post('/test', async (c) => {
  const body = await c.req.json()
  return c.json({
    message: 'Test POST received',
    data: body,
    timestamp: new Date().toISOString()
  })
})

testController.get('/test/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
    message: `Test controller received ID: ${id}`,
    id,
    timestamp: new Date().toISOString()
  })
})

export default testController