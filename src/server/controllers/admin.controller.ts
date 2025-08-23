import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { AdminService, CreateUserInput } from '@/server/services/admin.service'
import { CreateClinicBranchInput } from '@/server/models/clinic-branch.model'

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
 * Create a new clinic branch
 * POST /admin/clinic-branches
 */
adminController.post('/clinic-branches', async (c) => {
  try {
    const body = await c.req.json()
    const input: CreateClinicBranchInput = {
      name: body.name,
      address: body.address,
      phone: body.phone,
      email: body.email,
    }

    const result = await AdminService.createClinicBranch(input)
    
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
        message: 'Failed to create clinic branch' 
      }, 
      400
    )
  }
})

/**
 * Get all clinic branches
 * GET /admin/clinic-branches
 */
adminController.get('/clinic-branches', async (c) => {
  try {
    const result = await AdminService.getClinicBranches()
    
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
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to retrieve clinic branches', 
        message: 'An error occurred while getting clinic branches' 
      }, 
      500
    )
  }
})

/**
 * Get clinic branch by ID
 * GET /admin/clinic-branches/:id
 */
adminController.get('/clinic-branches/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    
    if (!id) {
      return c.json(
        { 
          success: false, 
          error: 'Missing clinic branch ID', 
          message: 'Clinic branch ID is required' 
        }, 
        400
      )
    }

    const result = await AdminService.getClinicBranchById(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Clinic branch not found' ? 404 : 400
      )
    }

    return c.json(
      { 
        success: true, 
        data: result.data, 
        message: result.message 
      }, 
      200
    )
  } catch (error: any) {
    return c.json(
      { 
        success: false, 
        error: 'Failed to retrieve clinic branch', 
        message: 'An error occurred while getting the clinic branch' 
      }, 
      500
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
