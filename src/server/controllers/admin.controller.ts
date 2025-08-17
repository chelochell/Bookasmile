import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { AdminService, CreateUserInput } from '@/server/services/admin.service'

const adminController = new Hono<{ Variables: AuthType }>({
  strict: false,
})

/**
 * Create a new user
 * POST /admin/users
 */
adminController.post('/users', async (c) => {
  try {
    const body = await c.req.json()
    const input: CreateUserInput = {
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role || 'patient',
      data: body.data || {},
    }

    const result = await AdminService.createUser(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      201
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Invalid request body', 
        message: 'Failed to create user' 
      }, 
      400
    )
  }
})



/**
 * Health check for admin controller
 * GET /admin/health
 */
adminController.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'admin-controller',
    timestamp: new Date().toISOString()
  })
})

export default adminController
