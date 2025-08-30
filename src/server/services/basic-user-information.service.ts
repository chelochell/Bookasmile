import { prisma } from '@/lib/prisma'
import { 
  createBasicUserInformationSchema, 
  updateBasicUserInformationSchema,
  basicUserInformationQuerySchema,
  CreateBasicUserInformationInput,
  UpdateBasicUserInformationInput,
  BasicUserInformationQueryParams
} from '@/server/models/basic-user-information.model'

export class BasicUserInformationService {
  /**
   * Create basic user information
   */
  static async createBasicUserInformation(input: CreateBasicUserInformationInput) {
    try {
      const validatedInput = createBasicUserInformationSchema.parse(input)
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: validatedInput.userId }
      })

      if (!user) {
        return {
          success: false,
          error: 'User not found',
          message: 'User does not exist'
        }
      }

      // Check if basic information already exists for this user
      const existingInfo = await prisma.basicUserInformation.findUnique({
        where: { userId: validatedInput.userId }
      })

      if (existingInfo) {
        return {
          success: false,
          error: 'Basic information already exists',
          message: 'User already has basic information. Use update instead.'
        }
      }

      // Convert string birth date to Date object
      const basicInfoData = {
        ...validatedInput,
        birthDate: new Date(validatedInput.birthDate),
      }

      const basicInfo = await prisma.basicUserInformation.create({
        data: basicInfoData,
        include: {
          user: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              image: true 
            } 
          }
        }
      })

      // Update user.name to firstName + lastName
      const fullName = `${validatedInput.firstName} ${validatedInput.lastName}`.trim()
      await prisma.user.update({
        where: { id: validatedInput.userId },
        data: { name: fullName }
      })

      return {
        success: true,
        data: basicInfo,
        message: 'Basic user information created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create basic user information',
        message: 'Basic user information creation failed'
      }
    }
  }

  /**
   * Get basic user information by user ID
   */
  static async getBasicUserInformationByUserId(userId: string) {
    try {
      const basicInfo = await prisma.basicUserInformation.findUnique({
        where: { userId },
        include: {
          user: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              image: true 
            } 
          }
        }
      })

      if (!basicInfo) {
        return {
          success: false,
          error: 'Basic user information not found',
          message: 'No basic information found for this user'
        }
      }

      return {
        success: true,
        data: basicInfo,
        message: 'Basic user information retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve basic user information',
        message: 'Failed to get basic user information'
      }
    }
  }

  /**
   * Get basic user information by ID
   */
  static async getBasicUserInformationById(id: string) {
    try {
      const basicInfo = await prisma.basicUserInformation.findUnique({
        where: { id },
        include: {
          user: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              image: true 
            } 
          }
        }
      })

      if (!basicInfo) {
        return {
          success: false,
          error: 'Basic user information not found',
          message: 'No basic information found with this ID'
        }
      }

      return {
        success: true,
        data: basicInfo,
        message: 'Basic user information retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve basic user information',
        message: 'Failed to get basic user information'
      }
    }
  }

  /**
   * Get basic user information with optional filtering and pagination
   */
  static async getBasicUserInformation(params: BasicUserInformationQueryParams) {
    try {
      const validatedParams = basicUserInformationQuerySchema.parse(params)
      
      const where: any = {}
      
      if (validatedParams.userId) {
        where.userId = validatedParams.userId
      }
      
      if (validatedParams.firstName) {
        where.firstName = {
          contains: validatedParams.firstName,
          mode: 'insensitive'
        }
      }
      
      if (validatedParams.lastName) {
        where.lastName = {
          contains: validatedParams.lastName,
          mode: 'insensitive'
        }
      }

      const [basicInfoList, total] = await Promise.all([
        prisma.basicUserInformation.findMany({
          where,
          include: {
            user: { 
              select: { 
                id: true, 
                name: true, 
                email: true, 
                image: true 
              } 
            }
          },
          orderBy: [
            { firstName: 'asc' },
            { lastName: 'asc' }
          ],
          take: validatedParams.limit || 50,
          skip: validatedParams.offset || 0,
        }),
        prisma.basicUserInformation.count({ where })
      ])

      return {
        success: true,
        data: {
          basicUserInformation: basicInfoList,
          pagination: {
            total,
            limit: validatedParams.limit || 50,
            offset: validatedParams.offset || 0,
            hasMore: (validatedParams.offset || 0) + basicInfoList.length < total
          }
        },
        message: 'Basic user information retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve basic user information',
        message: 'Failed to get basic user information'
      }
    }
  }

  /**
   * Update basic user information
   */
  static async updateBasicUserInformation(input: UpdateBasicUserInformationInput) {
    try {
      const validatedInput = updateBasicUserInformationSchema.parse(input)
      
      // Check if basic information exists
      const existingInfo = await prisma.basicUserInformation.findUnique({
        where: { userId: validatedInput.userId }
      })

      if (!existingInfo) {
        return {
          success: false,
          error: 'Basic user information not found',
          message: 'No basic information found for this user'
        }
      }

      // Prepare update data
      const updateData: any = {}
      
      if (validatedInput.firstName !== undefined) updateData.firstName = validatedInput.firstName
      if (validatedInput.lastName !== undefined) updateData.lastName = validatedInput.lastName
      if (validatedInput.middleInitial !== undefined) updateData.middleInitial = validatedInput.middleInitial
      if (validatedInput.birthDate !== undefined) updateData.birthDate = new Date(validatedInput.birthDate)
      if (validatedInput.gender !== undefined) updateData.gender = validatedInput.gender
      if (validatedInput.phoneNumber !== undefined) updateData.phoneNumber = validatedInput.phoneNumber
      if (validatedInput.address !== undefined) updateData.address = validatedInput.address
      if (validatedInput.region !== undefined) updateData.region = validatedInput.region
      if (validatedInput.province !== undefined) updateData.province = validatedInput.province
      if (validatedInput.city !== undefined) updateData.city = validatedInput.city
      if (validatedInput.barangay !== undefined) updateData.barangay = validatedInput.barangay
      if (validatedInput.zipCode !== undefined) updateData.zipCode = validatedInput.zipCode
      if (validatedInput.country !== undefined) updateData.country = validatedInput.country
      if (validatedInput.emergencyContactName !== undefined) updateData.emergencyContactName = validatedInput.emergencyContactName
      if (validatedInput.emergencyContactPhoneNumber !== undefined) updateData.emergencyContactPhoneNumber = validatedInput.emergencyContactPhoneNumber
      if (validatedInput.emergencyContactRelationship !== undefined) updateData.emergencyContactRelationship = validatedInput.emergencyContactRelationship

      const basicInfo = await prisma.basicUserInformation.update({
        where: { userId: validatedInput.userId },
        data: updateData,
        include: {
          user: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              image: true 
            } 
          }
        }
      })

      // Update user.name if firstName or lastName changed
      if (validatedInput.firstName !== undefined || validatedInput.lastName !== undefined) {
        const firstName = validatedInput.firstName || existingInfo.firstName
        const lastName = validatedInput.lastName || existingInfo.lastName
        const fullName = `${firstName} ${lastName}`.trim()
        
        await prisma.user.update({
          where: { id: validatedInput.userId },
          data: { name: fullName }
        })
      }

      return {
        success: true,
        data: basicInfo,
        message: 'Basic user information updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update basic user information',
        message: 'Basic user information update failed'
      }
    }
  }

  /**
   * Delete basic user information
   */
  static async deleteBasicUserInformation(userId: string) {
    try {
      // Check if basic information exists
      const existingInfo = await prisma.basicUserInformation.findUnique({
        where: { userId }
      })

      if (!existingInfo) {
        return {
          success: false,
          error: 'Basic user information not found',
          message: 'No basic information found for this user'
        }
      }

      await prisma.basicUserInformation.delete({
        where: { userId }
      })

      return {
        success: true,
        data: { userId },
        message: 'Basic user information deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete basic user information',
        message: 'Basic user information deletion failed'
      }
    }
  }

  /**
   * Check if user has basic information
   */
  static async hasBasicUserInformation(userId: string) {
    try {
      const basicInfo = await prisma.basicUserInformation.findUnique({
        where: { userId },
        select: { id: true }
      })

      return {
        success: true,
        data: { hasBasicInfo: !!basicInfo },
        message: 'Check completed successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to check basic user information',
        message: 'Failed to check basic user information'
      }
    }
  }
}
