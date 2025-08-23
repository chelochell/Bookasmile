import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { DentistService } from '@/server/services/dentist.service'
import {
  CreateDentistInput,
  UpdateDentistInput
} from '@/server/models/dentist.model'

const dentistController = new Hono<{ Variables: AuthType }>({
  strict: false,
})

/**
 * Create a new dentist
 * POST /dentists
 */
dentistController.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const input: CreateDentistInput = {
      userId: body.userId,
      specialization: body.specialization,
    }

    const result = await DentistService.createDentist(input)
    
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
        message: 'Failed to create dentist' 
      }, 
      400
    )
  }
})

/**
 * Get all dentists with optional filtering
 * GET /dentists
 */
dentistController.get('/', async (c) => {
  try {
    const query = c.req.query()
    const result = await DentistService.getDentists(query)
    
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
        error: 'Invalid query parameters', 
        message: 'Failed to get dentists' 
      }, 
      400
    )
  }
})

/**
 * Get dentist statistics
 * GET /dentists/stats
 */
dentistController.get('/stats', async (c) => {
  try {
    const result = await DentistService.getDentistStats()
    
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
        error: 'Failed to retrieve statistics', 
        message: 'Failed to get dentist statistics' 
      }, 
      400
    )
  }
})

/**
 * Get dentist by ID
 * GET /dentists/:id
 */
dentistController.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const includeRelations = c.req.query('includeRelations') === 'true'
    
    const result = await DentistService.getDentistById(id, includeRelations)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Dentist not found' ? 404 : 400
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
        error: 'Invalid dentist ID', 
        message: 'Failed to get dentist' 
      }, 
      400
    )
  }
})

/**
 * Get dentist by user ID
 * GET /dentists/user/:userId
 */
dentistController.get('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const includeRelations = c.req.query('includeRelations') === 'true'
    
    const result = await DentistService.getDentistByUserId(userId, includeRelations)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Dentist not found' ? 404 : 400
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
        error: 'Invalid user ID', 
        message: 'Failed to get dentist' 
      }, 
      400
    )
  }
})

/**
 * Update dentist
 * PUT /dentists/:id
 */
dentistController.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const input: UpdateDentistInput = {
      id,
      userId: body.userId,
      specialization: body.specialization,
    }

    const result = await DentistService.updateDentist(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Dentist not found' ? 404 : 400
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
        error: 'Invalid request body', 
        message: 'Failed to update dentist' 
      }, 
      400
    )
  }
})

/**
 * Delete dentist
 * DELETE /dentists/:id
 */
dentistController.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await DentistService.deleteDentist(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Dentist not found' ? 404 : 400
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
        error: 'Invalid dentist ID', 
        message: 'Failed to delete dentist' 
      }, 
      400
    )
  }
})

export default dentistController
