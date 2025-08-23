import { prisma } from '@/lib/prisma'
import { 
  createDentistSchema, 
  updateDentistSchema,
  dentistQuerySchema,
  CreateDentistInput,
  UpdateDentistInput,
  DentistQueryParams
} from '@/server/models/dentist.model'

export class DentistService {
  /**
   * Create a new dentist
   */
  static async createDentist(input: CreateDentistInput) {
    try {
      const validatedInput = createDentistSchema.parse(input)
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: validatedInput.userId }
      })

      if (!user) {
        return {
          success: false,
          error: 'User not found',
          message: 'No user found with this ID'
        }
      }

      // Check if user already has a dentist record
      const existingDentist = await prisma.dentist.findUnique({
        where: { userId: validatedInput.userId }
      })

      if (existingDentist) {
        return {
          success: false,
          error: 'Dentist already exists',
          message: 'This user already has a dentist record'
        }
      }

      // Update user role to dentist if not already set
      if (user.role !== 'dentist') {
        await prisma.user.update({
          where: { id: validatedInput.userId },
          data: { role: 'dentist' }
        })
      }

      const dentist = await prisma.dentist.create({
        data: {
          userId: validatedInput.userId,
          specialization: validatedInput.specialization,
        },
        include: {
          user: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              role: true, 
              createdAt: true 
            } 
          }
        }
      })

      return {
        success: true,
        data: dentist,
        message: 'Dentist created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create dentist',
        message: 'Dentist creation failed'
      }
    }
  }

  /**
   * Get dentist by ID
   */
  static async getDentistById(id: string, includeRelations = false) {
    try {
      const includeOptions: any = {
        user: { 
          select: { 
            id: true, 
            name: true, 
            email: true, 
            role: true, 
            createdAt: true 
          } 
        }
      }

      if (includeRelations) {
        includeOptions.availability = {
          include: {
            clinicBranch: true
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { standardStartTime: 'asc' }
          ]
        }
        includeOptions.specificAvailability = {
          include: {
            clinicBranch: true
          },
          orderBy: {
            startDateTime: 'asc'
          }
        }
        includeOptions.leaves = {
          orderBy: {
            startDateTime: 'asc'
          }
        }
      }

      const dentist = await prisma.dentist.findUnique({
        where: { id },
        include: includeOptions
      })

      if (!dentist) {
        return {
          success: false,
          error: 'Dentist not found',
          message: 'No dentist found with this ID'
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

  /**
   * Get dentist by user ID
   */
  static async getDentistByUserId(userId: string, includeRelations = false) {
    try {
      const includeOptions: any = {
        user: { 
          select: { 
            id: true, 
            name: true, 
            email: true, 
            role: true, 
            createdAt: true 
          } 
        }
      }

      if (includeRelations) {
        includeOptions.availability = {
          include: {
            clinicBranch: true
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { standardStartTime: 'asc' }
          ]
        }
        includeOptions.specificAvailability = {
          include: {
            clinicBranch: true
          },
          orderBy: {
            startDateTime: 'asc'
          }
        }
        includeOptions.leaves = {
          orderBy: {
            startDateTime: 'asc'
          }
        }
      }

      const dentist = await prisma.dentist.findUnique({
        where: { userId },
        include: includeOptions
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

  /**
   * Get dentists with optional filtering and pagination
   */
  static async getDentists(params: DentistQueryParams) {
    try {
      const validatedParams = dentistQuerySchema.parse(params)
      
      const where: any = {}
      
      if (validatedParams.userId) {
        where.userId = validatedParams.userId
      }
      
      if (validatedParams.specialization) {
        where.specialization = {
          has: validatedParams.specialization
        }
      }

      const includeOptions: any = {
        user: { 
          select: { 
            id: true, 
            name: true, 
            email: true, 
            role: true, 
            createdAt: true 
          } 
        }
      }

      if (validatedParams.includeAvailability) {
        includeOptions.availability = {
          include: {
            clinicBranch: true
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { standardStartTime: 'asc' }
          ]
        }
        includeOptions.specificAvailability = {
          include: {
            clinicBranch: true
          },
          orderBy: {
            startDateTime: 'asc'
          }
        }
        includeOptions.leaves = {
          orderBy: {
            startDateTime: 'asc'
          }
        }
      }

      const [dentists, total] = await Promise.all([
        prisma.dentist.findMany({
          where,
          include: includeOptions,
          orderBy: {
            user: {
              name: 'asc'
            }
          },
          take: validatedParams.limit || 50,
          skip: validatedParams.offset || 0,
        }),
        prisma.dentist.count({ where })
      ])

      return {
        success: true,
        data: {
          dentists,
          pagination: {
            total,
            limit: validatedParams.limit || 50,
            offset: validatedParams.offset || 0,
            hasMore: (validatedParams.offset || 0) + dentists.length < total
          }
        },
        message: 'Dentists retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve dentists',
        message: 'Failed to get dentists'
      }
    }
  }

  /**
   * Update a dentist
   */
  static async updateDentist(input: UpdateDentistInput) {
    try {
      const validatedInput = updateDentistSchema.parse(input)
      
      // Check if dentist exists
      const existingDentist = await prisma.dentist.findUnique({
        where: { id: validatedInput.id }
      })

      if (!existingDentist) {
        return {
          success: false,
          error: 'Dentist not found',
          message: 'No dentist found with this ID'
        }
      }

      // Prepare update data
      const updateData: any = {}
      
      if (validatedInput.userId) updateData.userId = validatedInput.userId
      if (validatedInput.specialization) updateData.specialization = validatedInput.specialization

      const dentist = await prisma.dentist.update({
        where: { id: validatedInput.id },
        data: updateData,
        include: {
          user: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              role: true, 
              createdAt: true 
            } 
          }
        }
      })

      return {
        success: true,
        data: dentist,
        message: 'Dentist updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update dentist',
        message: 'Dentist update failed'
      }
    }
  }

  /**
   * Delete a dentist
   */
  static async deleteDentist(id: string) {
    try {
      // Check if dentist exists
      const existingDentist = await prisma.dentist.findUnique({
        where: { id },
        include: {
          user: true
        }
      })

      if (!existingDentist) {
        return {
          success: false,
          error: 'Dentist not found',
          message: 'No dentist found with this ID'
        }
      }

      // Check if dentist has any future appointments
      const futureAppointments = await prisma.appointment.findFirst({
        where: {
          dentistId: existingDentist.userId,
          appointmentDate: {
            gte: new Date()
          }
        }
      })

      if (futureAppointments) {
        return {
          success: false,
          error: 'Cannot delete dentist with future appointments',
          message: 'This dentist has future appointments and cannot be deleted'
        }
      }

      // Delete dentist record (this will cascade delete related availability and leaves)
      await prisma.dentist.delete({
        where: { id }
      })

      // Optionally reset user role back to patient or keep as is
      // For now, we'll keep the user role unchanged
      
      return {
        success: true,
        data: { id },
        message: 'Dentist deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete dentist',
        message: 'Dentist deletion failed'
      }
    }
  }

  /**
   * Get dentist statistics
   */
  static async getDentistStats() {
    try {
      const [
        totalDentists,
        activeDentists,
        dentistsBySpecialization
      ] = await Promise.all([
        prisma.dentist.count(),
        prisma.dentist.count({
          where: {
            availability: {
              some: {}
            }
          }
        }),
        prisma.dentist.groupBy({
          by: ['specialization'],
          _count: {
            id: true
          }
        })
      ])

      // Process specialization stats
      const specializationStats = dentistsBySpecialization.reduce((acc: any, item: any) => {
        item.specialization.forEach((spec: string) => {
          acc[spec] = (acc[spec] || 0) + item._count.id
        })
        return acc
      }, {})

      return {
        success: true,
        data: {
          totalDentists,
          activeDentists,
          inactiveDentists: totalDentists - activeDentists,
          specializationStats
        },
        message: 'Dentist statistics retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve dentist statistics',
        message: 'Failed to get dentist statistics'
      }
    }
  }
}
