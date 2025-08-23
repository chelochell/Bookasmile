import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { AvailabilityService } from '@/server/services/availability.service'
import {
  CreateDentistAvailabilityInput,
  UpdateDentistAvailabilityInput,
  CreateSpecificDentistAvailabilityInput,
  UpdateSpecificDentistAvailabilityInput,
  CreateDentistLeavesInput,
  UpdateDentistLeavesInput
} from '@/server/models/availability.model'

const availabilityController = new Hono<{ Variables: AuthType }>({
  strict: false,
})

/**
 * Get dentist by user ID
 * GET /availability/dentist/:userId
 */
availabilityController.get('/dentist/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const result = await AvailabilityService.getDentistByUserId(userId)
    
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

// ==================== DENTIST AVAILABILITY ROUTES ====================

/**
 * Create a new dentist availability
 * POST /availability/dentist-availability
 */
availabilityController.post('/dentist-availability', async (c) => {
  try {
    const body = await c.req.json()
    const input: CreateDentistAvailabilityInput = {
      dentistId: body.dentistId,
      standardStartTime: body.standardStartTime,
      standardEndTime: body.standardEndTime,
      breakStartTime: body.breakStartTime,
      breakEndTime: body.breakEndTime,
      dayOfWeek: body.dayOfWeek,
      clinicBranchId: body.clinicBranchId,
    }

    const result = await AvailabilityService.createDentistAvailability(input)
    
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
        message: 'Failed to create dentist availability' 
      }, 
      400
    )
  }
})

/**
 * Get all dentist availabilities with optional filtering
 * GET /availability/dentist-availability
 */
availabilityController.get('/dentist-availability', async (c) => {
  try {
    const query = c.req.query()
    const result = await AvailabilityService.getDentistAvailabilities(query)
    
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
        message: 'Failed to get dentist availabilities' 
      }, 
      400
    )
  }
})

/**
 * Get dentist availability by ID
 * GET /availability/dentist-availability/:id
 */
availabilityController.get('/dentist-availability/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await AvailabilityService.getDentistAvailabilityById(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Availability not found' ? 404 : 400
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
        error: 'Invalid availability ID', 
        message: 'Failed to get dentist availability' 
      }, 
      400
    )
  }
})

/**
 * Update dentist availability
 * PUT /availability/dentist-availability/:id
 */
availabilityController.put('/dentist-availability/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const input: UpdateDentistAvailabilityInput = {
      id,
      dentistId: body.dentistId,
      standardStartTime: body.standardStartTime,
      standardEndTime: body.standardEndTime,
      breakStartTime: body.breakStartTime,
      breakEndTime: body.breakEndTime,
      dayOfWeek: body.dayOfWeek,
      clinicBranchId: body.clinicBranchId,
    }

    const result = await AvailabilityService.updateDentistAvailability(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Availability not found' ? 404 : 400
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
        message: 'Failed to update dentist availability' 
      }, 
      400
    )
  }
})

/**
 * Delete dentist availability
 * DELETE /availability/dentist-availability/:id
 */
availabilityController.delete('/dentist-availability/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await AvailabilityService.deleteDentistAvailability(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Availability not found' ? 404 : 400
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
        error: 'Invalid availability ID', 
        message: 'Failed to delete dentist availability' 
      }, 
      400
    )
  }
})

// ==================== SPECIFIC DENTIST AVAILABILITY ROUTES ====================

/**
 * Create a new specific dentist availability
 * POST /availability/specific-availability
 */
availabilityController.post('/specific-availability', async (c) => {
  try {
    const body = await c.req.json()
    const input: CreateSpecificDentistAvailabilityInput = {
      dentistId: body.dentistId,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
      clinicBranchId: body.clinicBranchId,
    }

    const result = await AvailabilityService.createSpecificDentistAvailability(input)
    
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
        message: 'Failed to create specific dentist availability' 
      }, 
      400
    )
  }
})

/**
 * Get all specific dentist availabilities with optional filtering
 * GET /availability/specific-availability
 */
availabilityController.get('/specific-availability', async (c) => {
  try {
    const query = c.req.query()
    const result = await AvailabilityService.getSpecificDentistAvailabilities(query)
    
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
        message: 'Failed to get specific dentist availabilities' 
      }, 
      400
    )
  }
})

/**
 * Get specific dentist availability by ID
 * GET /availability/specific-availability/:id
 */
availabilityController.get('/specific-availability/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await AvailabilityService.getSpecificDentistAvailabilityById(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Specific availability not found' ? 404 : 400
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
        error: 'Invalid availability ID', 
        message: 'Failed to get specific dentist availability' 
      }, 
      400
    )
  }
})

/**
 * Update specific dentist availability
 * PUT /availability/specific-availability/:id
 */
availabilityController.put('/specific-availability/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const input: UpdateSpecificDentistAvailabilityInput = {
      id,
      dentistId: body.dentistId,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
      clinicBranchId: body.clinicBranchId,
    }

    const result = await AvailabilityService.updateSpecificDentistAvailability(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Specific availability not found' ? 404 : 400
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
        message: 'Failed to update specific dentist availability' 
      }, 
      400
    )
  }
})

/**
 * Delete specific dentist availability
 * DELETE /availability/specific-availability/:id
 */
availabilityController.delete('/specific-availability/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await AvailabilityService.deleteSpecificDentistAvailability(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Specific availability not found' ? 404 : 400
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
        error: 'Invalid availability ID', 
        message: 'Failed to delete specific dentist availability' 
      }, 
      400
    )
  }
})

// ==================== DENTIST LEAVES ROUTES ====================

/**
 * Create a new dentist leave
 * POST /availability/leaves
 */
availabilityController.post('/leaves', async (c) => {
  try {
    const body = await c.req.json()
    const input: CreateDentistLeavesInput = {
      dentistId: body.dentistId,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
    }

    const result = await AvailabilityService.createDentistLeave(input)
    
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
        message: 'Failed to create dentist leave' 
      }, 
      400
    )
  }
})

/**
 * Get all dentist leaves with optional filtering
 * GET /availability/leaves
 */
availabilityController.get('/leaves', async (c) => {
  try {
    const query = c.req.query()
    const result = await AvailabilityService.getDentistLeaves(query)
    
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
        message: 'Failed to get dentist leaves' 
      }, 
      400
    )
  }
})

/**
 * Get dentist leave by ID
 * GET /availability/leaves/:id
 */
availabilityController.get('/leaves/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await AvailabilityService.getDentistLeaveById(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Leave not found' ? 404 : 400
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
        error: 'Invalid leave ID', 
        message: 'Failed to get dentist leave' 
      }, 
      400
    )
  }
})

/**
 * Update dentist leave
 * PUT /availability/leaves/:id
 */
availabilityController.put('/leaves/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const input: UpdateDentistLeavesInput = {
      id,
      dentistId: body.dentistId,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
    }

    const result = await AvailabilityService.updateDentistLeave(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Leave not found' ? 404 : 400
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
        message: 'Failed to update dentist leave' 
      }, 
      400
    )
  }
})

/**
 * Delete dentist leave
 * DELETE /availability/leaves/:id
 */
availabilityController.delete('/leaves/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await AvailabilityService.deleteDentistLeave(id)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Leave not found' ? 404 : 400
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
        error: 'Invalid leave ID', 
        message: 'Failed to delete dentist leave' 
      }, 
      400
    )
  }
})

export default availabilityController
