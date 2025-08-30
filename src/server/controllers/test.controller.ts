import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { getServerSession } from '@/actions/get-server-session'
import { NotificationService } from '@/server/services/notification.service'

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

// Test endpoint to create a notification for the current user
testController.post('/create-test-notification', async (c) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }

    const result = await NotificationService.createNotification({
      userId: session.user.id,
      title: 'Test Notification',
      message: 'This is a test notification to verify the notifications system is working correctly.',
      type: 'info'
    })

    if (!result.success) {
      return c.json({ success: false, error: result.error }, 400)
    }

    return c.json({ success: true, data: result.data })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

export default testController