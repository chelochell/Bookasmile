import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { AppointmentService } from '@/server/services/appointment.service'
import { CreateAppointmentInput, UpdateAppointmentInput } from '@/server/models/appointment.model'

const appointmentController = new Hono<{ Variables: AuthType }>({
  strict: false,
})

/**
 * Create a new appointment
 * POST /appointments
 */
appointmentController.post('/', async (c) => {
  try {
    const body = await c.req.json()
    console.log('🎯 Received appointment request body:', body)
    
    const input: CreateAppointmentInput = {
      patientId: body.patientId,
      dentistId: body.dentistId,
      scheduledBy: body.scheduledBy,
      appointmentDate: body.appointmentDate,
      startTime: body.startTime,
      endTime: body.endTime,
      notes: body.notes,
      notifContent: body.notifContent,
      treatmentOptions: body.treatmentOptions,
      status: body.status,  
      clinicBranchId: body.clinicBranchId,
      detailedNotes: body.detailedNotes,
    }

    console.log('📝 Processed input for service:', input)
    const result = await AppointmentService.createAppointment(input)
    
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
    console.error('❌ Controller error:', error)
    console.error('Error details:', error.message, error.stack)
    return c.json(
      { 
        success: false, 
        error: 'Invalid request body', 
        message: 'Failed to create appointment' 
      }, 
      400
    )
  }
})

/**
 * Get all appointments with optional filtering
 * GET /appointments
 */
appointmentController.get('/', async (c) => {
  try {
    const query = c.req.query()
    // Pass the raw query object - let the service handle validation and transformation
    const result = await AppointmentService.getAppointments(query)
    
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
        message: 'Failed to get appointments' 
      }, 
      400
    )
  }
})

/**
 * Get appointment by ID
 * GET /appointments/:id
 */
appointmentController.get('/:id', async (c) => {
  try {
    const appointmentId = c.req.param('id')
    
    if (!appointmentId) {
      return c.json(
        { 
          success: false, 
          error: 'Missing appointment ID', 
          message: 'Appointment ID is required' 
        }, 
        400
      )
    }

    const result = await AppointmentService.getAppointmentById(appointmentId)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Appointment not found' ? 404 : 400
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
        error: 'Failed to retrieve appointment', 
        message: 'An error occurred while getting the appointment' 
      }, 
      500
    )
  }
})

/**
 * Update an appointment
 * PUT /appointments/:id
 */
appointmentController.put('/:id', async (c) => {
  try {
    const appointmentId = c.req.param('id')
    const body = await c.req.json()
    
    if (!appointmentId) {
      return c.json(
        { 
          success: false, 
          error: 'Missing appointment ID', 
          message: 'Appointment ID is required' 
        }, 
        400
      )
    }

    const input: UpdateAppointmentInput = {
      appointmentId,
      patientId: body.patientId,
      dentistId: body.dentistId,
      scheduledBy: body.scheduledBy,
      appointmentDate: body.appointmentDate,
      startTime: body.startTime,
      endTime: body.endTime,
      notes: body.notes,
      notifContent: body.notifContent,
      treatmentOptions: body.treatmentOptions,
      status: body.status,
      clinicBranchId: body.clinicBranchId,
      detailedNotes: body.detailedNotes,
    }

    const result = await AppointmentService.updateAppointment(input)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Appointment not found' ? 404 : 400
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
        message: 'Failed to update appointment' 
      }, 
      400
    )
  }
})

/**
 * Delete an appointment
 * DELETE /appointments/:id
 */
appointmentController.delete('/:id', async (c) => {
  try {
    const appointmentId = c.req.param('id')
    
    if (!appointmentId) {
      return c.json(
        { 
          success: false, 
          error: 'Missing appointment ID', 
          message: 'Appointment ID is required' 
        }, 
        400
      )
    }

    const result = await AppointmentService.deleteAppointment(appointmentId)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Appointment not found' ? 404 : 400
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
        error: 'Failed to delete appointment', 
        message: 'An error occurred while deleting the appointment' 
      }, 
      500
    )
  }
})

/**
 * Health check for appointment controller
 * GET /appointments/health
 */
appointmentController.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'appointment-controller',
    timestamp: new Date().toISOString()
  })
})

export default appointmentController 