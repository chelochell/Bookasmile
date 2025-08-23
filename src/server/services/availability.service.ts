import { prisma } from '@/lib/prisma'
import { 
  createDentistAvailabilitySchema,
  updateDentistAvailabilitySchema,
  dentistAvailabilityQuerySchema,
  createSpecificDentistAvailabilitySchema,
  updateSpecificDentistAvailabilitySchema,
  specificDentistAvailabilityQuerySchema,
  createDentistLeavesSchema,
  updateDentistLeavesSchema,
  dentistLeavesQuerySchema,
  CreateDentistAvailabilityInput,
  UpdateDentistAvailabilityInput,
  DentistAvailabilityQueryParams,
  CreateSpecificDentistAvailabilityInput,
  UpdateSpecificDentistAvailabilityInput,
  SpecificDentistAvailabilityQueryParams,
  CreateDentistLeavesInput,
  UpdateDentistLeavesInput,
  DentistLeavesQueryParams
} from '@/server/models/availability.model'

export class AvailabilityService {
  /**
   * Get dentist by user ID
   */
  static async getDentistByUserId(userId: string) {
    try {
      const dentist = await prisma.dentist.findUnique({
        where: { userId },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } }
        }
      })

      if (!dentist) {
        return {
          success: false,
          error: 'Dentist not found',
          message: 'No dentist found for this user'
        }
      }

      return {
        success: true,
        data: dentist,
        message: 'Dentist retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve dentist',
        message: 'Failed to get dentist'
      }
    }
  }

  // ==================== DENTIST AVAILABILITY ====================

  /**
   * Create a new dentist availability record
   */
  static async createDentistAvailability(input: CreateDentistAvailabilityInput) {
    try {
      const validatedInput = createDentistAvailabilitySchema.parse(input)
      
      // Check if dentist exists
      const dentist = await prisma.dentist.findUnique({
        where: { id: validatedInput.dentistId }
      })

      if (!dentist) {
        return {
          success: false,
          error: 'Dentist not found',
          message: 'No dentist found with this ID'
        }
      }

      // Check if clinic branch exists
      const clinicBranch = await prisma.clinicBranch.findUnique({
        where: { id: validatedInput.clinicBranchId }
      })

      if (!clinicBranch) {
        return {
          success: false,
          error: 'Clinic branch not found',
          message: 'No clinic branch found with this ID'
        }
      }

      // Check for time overlaps with existing availability on the same day
      const existingAvailabilities = await prisma.dentistAvailability.findMany({
        where: {
          dentistId: validatedInput.dentistId,
          dayOfWeek: validatedInput.dayOfWeek,
          clinicBranchId: validatedInput.clinicBranchId
        }
      })

      // Helper function to convert time string to minutes
      const timeToMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        return hours * 60 + minutes
      }

      const newStartMinutes = timeToMinutes(validatedInput.standardStartTime)
      const newEndMinutes = timeToMinutes(validatedInput.standardEndTime)

      // Check for overlaps with existing time slots
      for (const existing of existingAvailabilities) {
        const existingStartMinutes = timeToMinutes(existing.standardStartTime)
        const existingEndMinutes = timeToMinutes(existing.standardEndTime)

        // Check if new time slot overlaps with existing one
        const hasOverlap = (
          (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes)
        )

        if (hasOverlap) {
          return {
            success: false,
            error: 'Time slot overlap detected',
            message: `New time slot (${validatedInput.standardStartTime}-${validatedInput.standardEndTime}) overlaps with existing slot (${existing.standardStartTime}-${existing.standardEndTime})`
          }
        }
      }

      const availability = await prisma.dentistAvailability.create({
        data: validatedInput,
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          },
          clinicBranch: true
        }
      })

      return {
        success: true,
        data: availability,
        message: 'Dentist availability created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create dentist availability',
        message: 'Dentist availability creation failed'
      }
    }
  }

  /**
   * Get dentist availability by ID
   */
  static async getDentistAvailabilityById(id: string) {
    try {
      const availability = await prisma.dentistAvailability.findUnique({
        where: { id },
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          },
          clinicBranch: true
        }
      })

      if (!availability) {
        return {
          success: false,
          error: 'Availability not found',
          message: 'No availability found with this ID'
        }
      }

      return {
        success: true,
        data: availability,
        message: 'Dentist availability retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve dentist availability',
        message: 'Failed to get dentist availability'
      }
    }
  }

  /**
   * Get dentist availabilities with optional filtering
   */
  static async getDentistAvailabilities(params: DentistAvailabilityQueryParams) {
    try {
      const validatedParams = dentistAvailabilityQuerySchema.parse(params)
      
      const where: any = {}
      
      if (validatedParams.dentistId) {
        where.dentistId = validatedParams.dentistId
      }
      
      if (validatedParams.dayOfWeek) {
        where.dayOfWeek = validatedParams.dayOfWeek
      }
      
      if (validatedParams.clinicBranchId) {
        where.clinicBranchId = validatedParams.clinicBranchId
      }

      const [availabilities, total] = await Promise.all([
        prisma.dentistAvailability.findMany({
          where,
          include: {
            dentist: {
              include: {
                user: { select: { id: true, name: true, email: true } }
              }
            },
            clinicBranch: true
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { standardStartTime: 'asc' }
          ],
          take: validatedParams.limit || 50,
          skip: validatedParams.offset || 0,
        }),
        prisma.dentistAvailability.count({ where })
      ])

      return {
        success: true,
        data: {
          availabilities,
          pagination: {
            total,
            limit: validatedParams.limit || 50,
            offset: validatedParams.offset || 0,
            hasMore: (validatedParams.offset || 0) + availabilities.length < total
          }
        },
        message: 'Dentist availabilities retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve dentist availabilities',
        message: 'Failed to get dentist availabilities'
      }
    }
  }

  /**
   * Update dentist availability
   */
  static async updateDentistAvailability(input: UpdateDentistAvailabilityInput) {
    try {
      const validatedInput = updateDentistAvailabilitySchema.parse(input)
      
      // Check if availability exists
      const existingAvailability = await prisma.dentistAvailability.findUnique({
        where: { id: validatedInput.id }
      })

      if (!existingAvailability) {
        return {
          success: false,
          error: 'Availability not found',
          message: 'No availability found with this ID'
        }
      }

      // Check for time overlaps if updating time-related fields
      if (validatedInput.standardStartTime || validatedInput.standardEndTime || 
          validatedInput.dentistId || validatedInput.dayOfWeek || validatedInput.clinicBranchId) {
        
        const dentistId = validatedInput.dentistId || existingAvailability.dentistId
        const dayOfWeek = validatedInput.dayOfWeek || existingAvailability.dayOfWeek
        const clinicBranchId = validatedInput.clinicBranchId || existingAvailability.clinicBranchId
        const startTime = validatedInput.standardStartTime || existingAvailability.standardStartTime
        const endTime = validatedInput.standardEndTime || existingAvailability.standardEndTime

        // Get all other availabilities for the same day/dentist/clinic (excluding current one)
        const otherAvailabilities = await prisma.dentistAvailability.findMany({
          where: {
            id: { not: validatedInput.id },
            dentistId,
            dayOfWeek,
            clinicBranchId
          }
        })

        // Helper function to convert time string to minutes
        const timeToMinutes = (timeStr: string): number => {
          const [hours, minutes] = timeStr.split(':').map(Number)
          return hours * 60 + minutes
        }

        const newStartMinutes = timeToMinutes(startTime)
        const newEndMinutes = timeToMinutes(endTime)

        // Check for overlaps with other time slots
        for (const other of otherAvailabilities) {
          const otherStartMinutes = timeToMinutes(other.standardStartTime)
          const otherEndMinutes = timeToMinutes(other.standardEndTime)

          // Check if updated time slot overlaps with existing one
          const hasOverlap = (
            (newStartMinutes < otherEndMinutes && newEndMinutes > otherStartMinutes)
          )

          if (hasOverlap) {
            return {
              success: false,
              error: 'Time slot overlap detected',
              message: `Updated time slot (${startTime}-${endTime}) would overlap with existing slot (${other.standardStartTime}-${other.standardEndTime})`
            }
          }
        }
      }

      const updateData: any = {}
      if (validatedInput.dentistId) updateData.dentistId = validatedInput.dentistId
      if (validatedInput.standardStartTime) updateData.standardStartTime = validatedInput.standardStartTime
      if (validatedInput.standardEndTime) updateData.standardEndTime = validatedInput.standardEndTime
      if (validatedInput.breakStartTime !== undefined) updateData.breakStartTime = validatedInput.breakStartTime
      if (validatedInput.breakEndTime !== undefined) updateData.breakEndTime = validatedInput.breakEndTime
      if (validatedInput.dayOfWeek) updateData.dayOfWeek = validatedInput.dayOfWeek
      if (validatedInput.clinicBranchId) updateData.clinicBranchId = validatedInput.clinicBranchId

      const availability = await prisma.dentistAvailability.update({
        where: { id: validatedInput.id },
        data: updateData,
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          },
          clinicBranch: true
        }
      })

      return {
        success: true,
        data: availability,
        message: 'Dentist availability updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update dentist availability',
        message: 'Dentist availability update failed'
      }
    }
  }

  /**
   * Delete dentist availability
   */
  static async deleteDentistAvailability(id: string) {
    try {
      const existingAvailability = await prisma.dentistAvailability.findUnique({
        where: { id }
      })

      if (!existingAvailability) {
        return {
          success: false,
          error: 'Availability not found',
          message: 'No availability found with this ID'
        }
      }

      await prisma.dentistAvailability.delete({
        where: { id }
      })

      return {
        success: true,
        data: { id },
        message: 'Dentist availability deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete dentist availability',
        message: 'Dentist availability deletion failed'
      }
    }
  }

  // ==================== SPECIFIC DENTIST AVAILABILITY ====================

  /**
   * Create a new specific dentist availability record
   */
  static async createSpecificDentistAvailability(input: CreateSpecificDentistAvailabilityInput) {
    try {
      const validatedInput = createSpecificDentistAvailabilitySchema.parse(input)
      
      // Check if dentist exists
      const dentist = await prisma.dentist.findUnique({
        where: { id: validatedInput.dentistId }
      })

      if (!dentist) {
        return {
          success: false,
          error: 'Dentist not found',
          message: 'No dentist found with this ID'
        }
      }

      // Check if clinic branch exists (if provided)
      if (validatedInput.clinicBranchId) {
        const clinicBranch = await prisma.clinicBranch.findUnique({
          where: { id: validatedInput.clinicBranchId }
        })

        if (!clinicBranch) {
          return {
            success: false,
            error: 'Clinic branch not found',
            message: 'No clinic branch found with this ID'
          }
        }
      }

      const specificAvailabilityData = {
        dentistId: validatedInput.dentistId,
        startDateTime: new Date(validatedInput.startDateTime),
        endDateTime: new Date(validatedInput.endDateTime),
        clinicBranchId: validatedInput.clinicBranchId || null,
      }

      const specificAvailability = await prisma.specificDentistAvailability.create({
        data: specificAvailabilityData,
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          },
          clinicBranch: true
        }
      })

      return {
        success: true,
        data: specificAvailability,
        message: 'Specific dentist availability created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create specific dentist availability',
        message: 'Specific dentist availability creation failed'
      }
    }
  }

  /**
   * Get specific dentist availability by ID
   */
  static async getSpecificDentistAvailabilityById(id: string) {
    try {
      const specificAvailability = await prisma.specificDentistAvailability.findUnique({
        where: { id },
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          },
          clinicBranch: true
        }
      })

      if (!specificAvailability) {
        return {
          success: false,
          error: 'Specific availability not found',
          message: 'No specific availability found with this ID'
        }
      }

      return {
        success: true,
        data: specificAvailability,
        message: 'Specific dentist availability retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve specific dentist availability',
        message: 'Failed to get specific dentist availability'
      }
    }
  }

  /**
   * Get specific dentist availabilities with optional filtering
   */
  static async getSpecificDentistAvailabilities(params: SpecificDentistAvailabilityQueryParams) {
    try {
      const validatedParams = specificDentistAvailabilityQuerySchema.parse(params)
      
      const where: any = {}
      
      if (validatedParams.dentistId) {
        where.dentistId = validatedParams.dentistId
      }
      
      if (validatedParams.clinicBranchId) {
        where.clinicBranchId = validatedParams.clinicBranchId
      }
      
      if (validatedParams.startDate || validatedParams.endDate) {
        where.startDateTime = {}
        if (validatedParams.startDate) {
          where.startDateTime.gte = new Date(validatedParams.startDate)
        }
        if (validatedParams.endDate) {
          where.endDateTime = where.endDateTime || {}
          where.endDateTime.lte = new Date(validatedParams.endDate)
        }
      }

      const [specificAvailabilities, total] = await Promise.all([
        prisma.specificDentistAvailability.findMany({
          where,
          include: {
            dentist: {
              include: {
                user: { select: { id: true, name: true, email: true } }
              }
            },
            clinicBranch: true
          },
          orderBy: [
            { startDateTime: 'asc' }
          ],
          take: validatedParams.limit || 50,
          skip: validatedParams.offset || 0,
        }),
        prisma.specificDentistAvailability.count({ where })
      ])

      return {
        success: true,
        data: {
          specificAvailabilities,
          pagination: {
            total,
            limit: validatedParams.limit || 50,
            offset: validatedParams.offset || 0,
            hasMore: (validatedParams.offset || 0) + specificAvailabilities.length < total
          }
        },
        message: 'Specific dentist availabilities retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve specific dentist availabilities',
        message: 'Failed to get specific dentist availabilities'
      }
    }
  }

  /**
   * Update specific dentist availability
   */
  static async updateSpecificDentistAvailability(input: UpdateSpecificDentistAvailabilityInput) {
    try {
      const validatedInput = updateSpecificDentistAvailabilitySchema.parse(input)
      
      // Check if specific availability exists
      const existingSpecificAvailability = await prisma.specificDentistAvailability.findUnique({
        where: { id: validatedInput.id }
      })

      if (!existingSpecificAvailability) {
        return {
          success: false,
          error: 'Specific availability not found',
          message: 'No specific availability found with this ID'
        }
      }

      const updateData: any = {}
      if (validatedInput.dentistId) updateData.dentistId = validatedInput.dentistId
      if (validatedInput.startDateTime) updateData.startDateTime = new Date(validatedInput.startDateTime)
      if (validatedInput.endDateTime) updateData.endDateTime = new Date(validatedInput.endDateTime)
      if (validatedInput.clinicBranchId !== undefined) updateData.clinicBranchId = validatedInput.clinicBranchId

      const specificAvailability = await prisma.specificDentistAvailability.update({
        where: { id: validatedInput.id },
        data: updateData,
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          },
          clinicBranch: true
        }
      })

      return {
        success: true,
        data: specificAvailability,
        message: 'Specific dentist availability updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update specific dentist availability',
        message: 'Specific dentist availability update failed'
      }
    }
  }

  /**
   * Delete specific dentist availability
   */
  static async deleteSpecificDentistAvailability(id: string) {
    try {
      const existingSpecificAvailability = await prisma.specificDentistAvailability.findUnique({
        where: { id }
      })

      if (!existingSpecificAvailability) {
        return {
          success: false,
          error: 'Specific availability not found',
          message: 'No specific availability found with this ID'
        }
      }

      await prisma.specificDentistAvailability.delete({
        where: { id }
      })

      return {
        success: true,
        data: { id },
        message: 'Specific dentist availability deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete specific dentist availability',
        message: 'Specific dentist availability deletion failed'
      }
    }
  }

  // ==================== DENTIST LEAVES ====================

  /**
   * Create a new dentist leave record
   */
  static async createDentistLeave(input: CreateDentistLeavesInput) {
    try {
      const validatedInput = createDentistLeavesSchema.parse(input)
      
      // Check if dentist exists
      const dentist = await prisma.dentist.findUnique({
        where: { id: validatedInput.dentistId }
      })

      if (!dentist) {
        return {
          success: false,
          error: 'Dentist not found',
          message: 'No dentist found with this ID'
        }
      }

      const leaveData = {
        dentistId: validatedInput.dentistId,
        startDateTime: new Date(validatedInput.startDateTime),
        endDateTime: new Date(validatedInput.endDateTime),
      }

      const leave = await prisma.dentistLeaves.create({
        data: leaveData,
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      })

      return {
        success: true,
        data: leave,
        message: 'Dentist leave created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create dentist leave',
        message: 'Dentist leave creation failed'
      }
    }
  }

  /**
   * Get dentist leave by ID
   */
  static async getDentistLeaveById(id: string) {
    try {
      const leave = await prisma.dentistLeaves.findUnique({
        where: { id },
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      })

      if (!leave) {
        return {
          success: false,
          error: 'Leave not found',
          message: 'No leave found with this ID'
        }
      }

      return {
        success: true,
        data: leave,
        message: 'Dentist leave retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve dentist leave',
        message: 'Failed to get dentist leave'
      }
    }
  }

  /**
   * Get dentist leaves with optional filtering
   */
  static async getDentistLeaves(params: DentistLeavesQueryParams) {
    try {
      const validatedParams = dentistLeavesQuerySchema.parse(params)
      
      const where: any = {}
      
      if (validatedParams.dentistId) {
        where.dentistId = validatedParams.dentistId
      }
      
      if (validatedParams.startDate || validatedParams.endDate) {
        where.startDateTime = {}
        if (validatedParams.startDate) {
          where.startDateTime.gte = new Date(validatedParams.startDate)
        }
        if (validatedParams.endDate) {
          where.endDateTime = where.endDateTime || {}
          where.endDateTime.lte = new Date(validatedParams.endDate)
        }
      }

      const [leaves, total] = await Promise.all([
        prisma.dentistLeaves.findMany({
          where,
          include: {
            dentist: {
              include: {
                user: { select: { id: true, name: true, email: true } }
              }
            }
          },
          orderBy: [
            { startDateTime: 'asc' }
          ],
          take: validatedParams.limit || 50,
          skip: validatedParams.offset || 0,
        }),
        prisma.dentistLeaves.count({ where })
      ])

      return {
        success: true,
        data: {
          leaves,
          pagination: {
            total,
            limit: validatedParams.limit || 50,
            offset: validatedParams.offset || 0,
            hasMore: (validatedParams.offset || 0) + leaves.length < total
          }
        },
        message: 'Dentist leaves retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve dentist leaves',
        message: 'Failed to get dentist leaves'
      }
    }
  }

  /**
   * Update dentist leave
   */
  static async updateDentistLeave(input: UpdateDentistLeavesInput) {
    try {
      const validatedInput = updateDentistLeavesSchema.parse(input)
      
      // Check if leave exists
      const existingLeave = await prisma.dentistLeaves.findUnique({
        where: { id: validatedInput.id }
      })

      if (!existingLeave) {
        return {
          success: false,
          error: 'Leave not found',
          message: 'No leave found with this ID'
        }
      }

      const updateData: any = {}
      if (validatedInput.dentistId) updateData.dentistId = validatedInput.dentistId
      if (validatedInput.startDateTime) updateData.startDateTime = new Date(validatedInput.startDateTime)
      if (validatedInput.endDateTime) updateData.endDateTime = new Date(validatedInput.endDateTime)

      const leave = await prisma.dentistLeaves.update({
        where: { id: validatedInput.id },
        data: updateData,
        include: {
          dentist: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      })

      return {
        success: true,
        data: leave,
        message: 'Dentist leave updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update dentist leave',
        message: 'Dentist leave update failed'
      }
    }
  }

  /**
   * Delete dentist leave
   */
  static async deleteDentistLeave(id: string) {
    try {
      const existingLeave = await prisma.dentistLeaves.findUnique({
        where: { id }
      })

      if (!existingLeave) {
        return {
          success: false,
          error: 'Leave not found',
          message: 'No leave found with this ID'
        }
      }

      await prisma.dentistLeaves.delete({
        where: { id }
      })

      return {
        success: true,
        data: { id },
        message: 'Dentist leave deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete dentist leave',
        message: 'Dentist leave deletion failed'
      }
    }
  }
}
