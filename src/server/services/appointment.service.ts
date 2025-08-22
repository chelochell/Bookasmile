import { prisma } from '@/lib/prisma'
import { 
  createAppointmentSchema, 
  updateAppointmentSchema,
  appointmentQuerySchema,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentQueryParams
} from '@/server/models/appointment.model'

export class AppointmentService {
  /**
   * Create a new appointment
   */
  static async createAppointment(input: CreateAppointmentInput) {
    try {
      const validatedInput = createAppointmentSchema.parse(input)
      
      // Convert string dates to Date objects
      const appointmentData = {
        patientId: validatedInput.patientId,
        dentistId: validatedInput.dentistId || null,
        scheduledBy: validatedInput.scheduledBy,
        appointmentDate: new Date(validatedInput.appointmentDate),
        startTime: new Date(validatedInput.startTime),
        endTime: validatedInput.endTime ? new Date(validatedInput.endTime) : null,
        notes: validatedInput.notes || null,
        notifContent: validatedInput.notifContent || null,
        treatmentOptions: validatedInput.treatmentOptions || [],
        status: validatedInput.status || 'pending',
      }

      // Check for scheduling conflicts (only if dentist is assigned)
      let conflictingAppointment = null
      if (appointmentData.dentistId) {
        conflictingAppointment = await prisma.appointment.findFirst({
          where: {
            dentistId: appointmentData.dentistId,
            appointmentDate: appointmentData.appointmentDate,
            OR: [
              {
                AND: [
                  { startTime: { lte: appointmentData.startTime } },
                  { 
                    OR: [
                      { endTime: { gte: appointmentData.startTime } },
                      { endTime: null }
                    ]
                  }
                ]
              },
              appointmentData.endTime ? {
                AND: [
                  { startTime: { lte: appointmentData.endTime } },
                  { 
                    OR: [
                      { endTime: { gte: appointmentData.endTime } },
                      { endTime: null }
                    ]
                  }
                ]
              } : {}
            ]
          }
        })
      }

      if (conflictingAppointment) {
        return {
          success: false,
          error: 'Schedule conflict detected',
          message: 'The dentist has another appointment at this time'
        }
      }

      const appointment = await prisma.appointment.create({
        data: appointmentData,
        include: {
          patient: { select: { id: true, name: true, email: true } },
          dentist: { select: { id: true, name: true, email: true } },
          scheduledByUser: { select: { id: true, name: true, email: true } }
        }
      })

      return {
        success: true,
        data: appointment,
        message: 'Appointment created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create appointment',
        message: 'Appointment creation failed'
      }
    }
  }

  /**
   * Get appointment by ID
   */
  static async getAppointmentById(appointmentId: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { appointmentId },
        include: {
          patient: { select: { id: true, name: true, email: true } },
          dentist: { select: { id: true, name: true, email: true } },
          scheduledByUser: { select: { id: true, name: true, email: true } }
        }
      })

      if (!appointment) {
        return {
          success: false,
          error: 'Appointment not found',
          message: 'No appointment found with this ID'
        }
      }

      return {
        success: true,
        data: appointment,
        message: 'Appointment retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve appointment',
        message: 'Failed to get appointment'
      }
    }
  }

  /**
   * Get appointments with optional filtering and pagination
   */
  static async getAppointments(params: AppointmentQueryParams) {
    try {
      const validatedParams = appointmentQuerySchema.parse(params)
      
      const where: any = {}
      
      if (validatedParams.patientId) {
        where.patientId = validatedParams.patientId
      }
      
      if (validatedParams.dentistId) {
        where.dentistId = validatedParams.dentistId
      }
      
      if (validatedParams.status) {
        where.status = validatedParams.status
      }
      
      if (validatedParams.startDate || validatedParams.endDate) {
        where.appointmentDate = {}
        if (validatedParams.startDate) {
          where.appointmentDate.gte = new Date(validatedParams.startDate)
        }
        if (validatedParams.endDate) {
          where.appointmentDate.lte = new Date(validatedParams.endDate)
        }
      }

      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where,
          include: {
            patient: { select: { id: true, name: true, email: true } },
            dentist: { select: { id: true, name: true, email: true } },
            scheduledByUser: { select: { id: true, name: true, email: true } }
          },
          orderBy: [
            { appointmentDate: 'asc' },
            { startTime: 'asc' }
          ],
          take: validatedParams.limit || 50,
          skip: validatedParams.offset || 0,
        }),
        prisma.appointment.count({ where })
      ])

      return {
        success: true,
        data: {
          appointments,
          pagination: {
            total,
            limit: validatedParams.limit || 50,
            offset: validatedParams.offset || 0,
            hasMore: (validatedParams.offset || 0) + appointments.length < total
          }
        },
        message: 'Appointments retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve appointments',
        message: 'Failed to get appointments'
      }
    }
  }

  /**
   * Update an appointment
   */
  static async updateAppointment(input: UpdateAppointmentInput) {
    try {
      const validatedInput = updateAppointmentSchema.parse(input)
      
      // Check if appointment exists
      const existingAppointment = await prisma.appointment.findUnique({
        where: { appointmentId: validatedInput.appointmentId }
      })

      if (!existingAppointment) {
        return {
          success: false,
          error: 'Appointment not found',
          message: 'No appointment found with this ID'
        }
      }

      // Prepare update data
      const updateData: any = {}
      
      if (validatedInput.patientId) updateData.patientId = validatedInput.patientId
      if (validatedInput.dentistId !== undefined) updateData.dentistId = validatedInput.dentistId || null
      if (validatedInput.scheduledBy) updateData.scheduledBy = validatedInput.scheduledBy
      if (validatedInput.appointmentDate) updateData.appointmentDate = new Date(validatedInput.appointmentDate)
      if (validatedInput.startTime) updateData.startTime = new Date(validatedInput.startTime)
      if (validatedInput.endTime) updateData.endTime = new Date(validatedInput.endTime)
      if (validatedInput.notes !== undefined) updateData.notes = validatedInput.notes
      if (validatedInput.notifContent !== undefined) updateData.notifContent = validatedInput.notifContent
      if (validatedInput.treatmentOptions !== undefined) updateData.treatmentOptions = validatedInput.treatmentOptions
      if (validatedInput.status !== undefined) updateData.status = validatedInput.status

      // Check for scheduling conflicts if time/date/dentist is being updated
      if (updateData.dentistId !== undefined || updateData.appointmentDate || updateData.startTime || updateData.endTime) {
        const dentistId = updateData.dentistId !== undefined ? updateData.dentistId : existingAppointment.dentistId
        const appointmentDate = updateData.appointmentDate || existingAppointment.appointmentDate
        const startTime = updateData.startTime || existingAppointment.startTime
        const endTime = updateData.endTime || existingAppointment.endTime

        // Only check for conflicts if there's a dentist assigned
        if (dentistId) {
          const conflictingAppointment = await prisma.appointment.findFirst({
            where: {
              appointmentId: { not: validatedInput.appointmentId },
              dentistId: dentistId,
              appointmentDate: appointmentDate,
              OR: [
                {
                  AND: [
                    { startTime: { lte: startTime } },
                    { 
                      OR: [
                        { endTime: { gte: startTime } },
                        { endTime: null }
                      ]
                    }
                  ]
                },
                endTime ? {
                  AND: [
                    { startTime: { lte: endTime } },
                    { 
                      OR: [
                        { endTime: { gte: endTime } },
                        { endTime: null }
                      ]
                    }
                  ]
                } : {}
              ]
            }
          })

          if (conflictingAppointment) {
            return {
              success: false,
              error: 'Schedule conflict detected',
              message: 'The dentist has another appointment at this time'
            }
          }
        }
      }

      const appointment = await prisma.appointment.update({
        where: { appointmentId: validatedInput.appointmentId },
        data: updateData,
        include: {
          patient: { select: { id: true, name: true, email: true } },
          dentist: { select: { id: true, name: true, email: true } },
          scheduledByUser: { select: { id: true, name: true, email: true } }
        }
      })

      return {
        success: true,
        data: appointment,
        message: 'Appointment updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update appointment',
        message: 'Appointment update failed'
      }
    }
  }

  /**
   * Delete an appointment
   */
  static async deleteAppointment(appointmentId: string) {
    try {
      // Check if appointment exists
      const existingAppointment = await prisma.appointment.findUnique({
        where: { appointmentId }
      })

      if (!existingAppointment) {
        return {
          success: false,
          error: 'Appointment not found',
          message: 'No appointment found with this ID'
        }
      }

      await prisma.appointment.delete({
        where: { appointmentId }
      })

      return {
        success: true,
        data: { appointmentId },
        message: 'Appointment deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete appointment',
        message: 'Appointment deletion failed'
      }
    }
  }
} 