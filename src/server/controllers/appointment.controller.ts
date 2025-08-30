import { Hono } from 'hono'
import { AuthType } from '@/auth'
import { AppointmentService } from '@/server/services/appointment.service'
import { CreateAppointmentInput, UpdateAppointmentInput } from '@/server/models/appointment.model'
import { getServerSession } from '@/actions/get-server-session'

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
 * Confirm an appointment
 * PATCH /appointments/:id/confirm
 */
appointmentController.patch('/:id/confirm', async (c) => {
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

    // Check user role for authorization
    const session = await getServerSession()
    if (!session?.user) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const userRole = session.user.role
    if (!userRole) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'User role not found' 
        }, 
        401
      )
    }

    const allowedRoles = ['dentist', 'secretary', 'super_admin']
    
    if (!allowedRoles.includes(userRole)) {
      return c.json(
        { 
          success: false, 
          error: 'Forbidden', 
          message: 'Insufficient permissions to confirm appointments' 
        }, 
        403
      )
    }

    const result = await AppointmentService.confirmAppointment(appointmentId)
    
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
        error: 'Failed to confirm appointment', 
        message: 'An error occurred while confirming the appointment' 
      }, 
      500
    )
  }
})

/**
 * Reschedule an appointment
 * PATCH /appointments/:id/reschedule
 */
appointmentController.patch('/:id/reschedule', async (c) => {
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

    // Check user role for authorization
    const session = await getServerSession()
    if (!session?.user) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const userRole = session.user.role
    if (!userRole) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'User role not found' 
        }, 
        401
      )
    }

    const allowedRoles = ['dentist', 'secretary', 'super_admin']
    
    if (!allowedRoles.includes(userRole)) {
      return c.json(
        { 
          success: false, 
          error: 'Forbidden', 
          message: 'Insufficient permissions to reschedule appointments' 
        }, 
        403
      )
    }

    if (!body.newDate || !body.newStartTime) {
      return c.json(
        { 
          success: false, 
          error: 'Missing required fields', 
          message: 'New date and start time are required' 
        }, 
        400
      )
    }

    const result = await AppointmentService.rescheduleAppointment(
      appointmentId,
      body.newDate,
      body.newStartTime,
      body.newEndTime
    )
    
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
        error: 'Failed to reschedule appointment', 
        message: 'An error occurred while rescheduling the appointment' 
      }, 
      500
    )
  }
})

/**
 * Assign a dentist to an appointment
 * PATCH /appointments/:id/assign-dentist
 */
appointmentController.patch('/:id/assign-dentist', async (c) => {
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

    // Check user role for authorization
    const session = await getServerSession()
    if (!session?.user) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const userRole = session.user.role
    if (!userRole) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'User role not found' 
        }, 
        401
      )
    }

    const allowedRoles = ['dentist', 'secretary', 'super_admin']
    
    if (!allowedRoles.includes(userRole)) {
      return c.json(
        { 
          success: false, 
          error: 'Forbidden', 
          message: 'Insufficient permissions to assign dentists' 
        }, 
        403
      )
    }

    if (!body.dentistId) {
      return c.json(
        { 
          success: false, 
          error: 'Missing dentist ID', 
          message: 'Dentist ID is required' 
        }, 
        400
      )
    }

    const result = await AppointmentService.assignDentist(appointmentId, body.dentistId)
    
    if (!result.success) {
      return c.json(
        { 
          success: false, 
          error: result.error, 
          message: result.message 
        }, 
        result.error === 'Appointment not found' || result.error === 'Dentist not found' ? 404 : 400
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
        error: 'Failed to assign dentist', 
        message: 'An error occurred while assigning the dentist' 
      }, 
      500
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

    // Check user role for authorization
    const session = await getServerSession()
    if (!session?.user) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const userRole = session.user.role
    if (!userRole) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'User role not found' 
        }, 
        401
      )
    }

    const allowedRoles = ['dentist', 'secretary', 'super_admin']
    
    if (!allowedRoles.includes(userRole)) {
      return c.json(
        { 
          success: false, 
          error: 'Forbidden', 
          message: 'Insufficient permissions to delete appointments' 
        }, 
        403
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
 * Cancel an appointment (set status to cancelled)
 * PATCH /appointments/:id/cancel
 */
appointmentController.patch('/:id/cancel', async (c) => {
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

    // Check user role for authorization
    const session = await getServerSession()
    if (!session?.user) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const userRole = session.user.role
    if (!userRole) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'User role not found' 
        }, 
        401
      )
    }

    const allowedRoles = ['dentist', 'secretary', 'super_admin']
    
    if (!allowedRoles.includes(userRole)) {
      return c.json(
        { 
          success: false, 
          error: 'Forbidden', 
          message: 'Insufficient permissions to cancel appointments' 
        }, 
        403
      )
    }

    const result = await AppointmentService.cancelAppointment(appointmentId)
    
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
        error: 'Failed to cancel appointment', 
        message: 'An error occurred while cancelling the appointment' 
      }, 
      500
    )
  }
})

/**
 * Reset appointment status to pending
 * PATCH /appointments/:id/reset-status
 */
appointmentController.patch('/:id/reset-status', async (c) => {
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

    // Check user role for authorization
    const session = await getServerSession()
    if (!session?.user) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }, 
        401
      )
    }

    const userRole = session.user.role
    if (!userRole) {
      return c.json(
        { 
          success: false, 
          error: 'Unauthorized', 
          message: 'User role not found' 
        }, 
        401
      )
    }

    const allowedRoles = ['dentist', 'secretary', 'super_admin']
    
    if (!allowedRoles.includes(userRole)) {
      return c.json(
        { 
          success: false, 
          error: 'Forbidden', 
          message: 'Insufficient permissions to reset appointment status' 
        }, 
        403
      )
    }

    const result = await AppointmentService.resetAppointmentStatus(appointmentId)
    
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
        error: 'Failed to reset appointment status', 
        message: 'An error occurred while resetting the appointment status' 
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