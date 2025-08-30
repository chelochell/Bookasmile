import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { BasicUserInformationService } from '@/server/services/basic-user-information.service'
import {
  CreateBasicUserInformationInput,
  UpdateBasicUserInformationInput
} from '@/server/models/basic-user-information.model'

const basicUserInformationController = new Hono<{ Variables: AuthType }>({
  strict: false,
})

/**
 * Create basic user information
 * POST /basic-user-information
 */
basicUserInformationController.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const input: CreateBasicUserInformationInput = {
      userId: body.userId,
      firstName: body.firstName,
      lastName: body.lastName,
      middleInitial: body.middleInitial,
      birthDate: body.birthDate,
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      address: body.address,
      region: body.region,
      province: body.province,
      city: body.city,
      barangay: body.barangay,
      zipCode: body.zipCode,
      country: body.country || 'Philippines',
      emergencyContactName: body.emergencyContactName,
      emergencyContactPhoneNumber: body.emergencyContactPhoneNumber,
      emergencyContactRelationship: body.emergencyContactRelationship,
    }

    const result = await BasicUserInformationService.createBasicUserInformation(input)
    
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
        message: 'Failed to create basic user information' 
      }, 
      400
    )
  }
})

/**
 * Get all basic user information with optional filtering
 * GET /basic-user-information
 */
basicUserInformationController.get('/', async (c) => {
  try {
    const query = c.req.query()
    const result = await BasicUserInformationService.getBasicUserInformation(query)
    
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
        message: 'Failed to get basic user information' 
      }, 
      400
    )
  }
})

/**
 * Get basic user information by ID
 * GET /basic-user-information/:id
 */
basicUserInformationController.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const result = await BasicUserInformationService.getBasicUserInformationById(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Basic user information not found' ? 404 : 400
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
        error: 'Invalid ID', 
        message: 'Failed to get basic user information' 
      }, 
      400
    )
  }
})

/**
 * Get basic user information by user ID
 * GET /basic-user-information/user/:userId
 */
basicUserInformationController.get('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    
    const result = await BasicUserInformationService.getBasicUserInformationByUserId(userId)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Basic user information not found' ? 404 : 400
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
        message: 'Failed to get basic user information' 
      }, 
      400
    )
  }
})

/**
 * Check if user has basic information
 * GET /basic-user-information/user/:userId/check
 */
basicUserInformationController.get('/user/:userId/check', async (c) => {
  try {
    const userId = c.req.param('userId')
    
    const result = await BasicUserInformationService.hasBasicUserInformation(userId)
    
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
        error: 'Invalid user ID', 
        message: 'Failed to check basic user information' 
      }, 
      400
    )
  }
})

/**
 * Update basic user information
 * PUT /basic-user-information/user/:userId
 */
basicUserInformationController.put('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const body = await c.req.json()
    
    const input: UpdateBasicUserInformationInput = {
      userId,
      firstName: body.firstName,
      lastName: body.lastName,
      middleInitial: body.middleInitial,
      birthDate: body.birthDate,
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      address: body.address,
      region: body.region,
      province: body.province,
      city: body.city,
      barangay: body.barangay,
      zipCode: body.zipCode,
      country: body.country,
      emergencyContactName: body.emergencyContactName,
      emergencyContactPhoneNumber: body.emergencyContactPhoneNumber,
      emergencyContactRelationship: body.emergencyContactRelationship,
    }

    const result = await BasicUserInformationService.updateBasicUserInformation(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Basic user information not found' ? 404 : 400
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
        message: 'Failed to update basic user information' 
      }, 
      400
    )
  }
})

/**
 * Delete basic user information
 * DELETE /basic-user-information/user/:userId
 */
basicUserInformationController.delete('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const result = await BasicUserInformationService.deleteBasicUserInformation(userId)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Basic user information not found' ? 404 : 400
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
        message: 'Failed to delete basic user information' 
      }, 
      400
    )
  }
})

export default basicUserInformationController
