import { auth } from '@/auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { 
  createClinicBranchSchema, 
  CreateClinicBranchInput 
} from '@/server/models/clinic-branch.model'

// Validation schema for creating users
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['patient', 'admin', 'dentist', 'secretary', 'super_admin']).optional().default('patient'),
  data: z.record(z.string(), z.any()).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export class AdminService {
  /**
   * Create a new user with role using better-auth admin API
   */
  static async createUser(input: CreateUserInput) {
    try {
      const validatedInput = createUserSchema.parse(input)
      
      const newUser = await auth.api.createUser({
        body: {
          email: validatedInput.email,
          password: validatedInput.password,
          name: validatedInput.name,
          role: (validatedInput.role === 'admin' || validatedInput.role === 'super_admin') ? 'super_admin' : validatedInput.role, // Map admin to user for better-auth
          data: {
            customRole: validatedInput.role, // Store custom role in data
            ...validatedInput.data || {},
          },
        },
      })

      return {
        success: true,
        data: {
          id: newUser.user.id,
          email: newUser.user.email,
          name: newUser.user.name,
          role: validatedInput.role, // Return the custom role
          createdAt: newUser.user.createdAt,
        },
        message: 'User created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create user',
        message: 'User creation failed'
      }
    }
  }

  /**
   * Create a new clinic branch
   */
  static async createClinicBranch(input: CreateClinicBranchInput) {
    try {
      const validatedInput = createClinicBranchSchema.parse(input)
      
      // Check if clinic branch with same email already exists
      const existingBranch = await prisma.clinicBranch.findFirst({
        where: { email: validatedInput.email }
      })

      if (existingBranch) {
        return {
          success: false,
          error: 'Clinic branch with this email already exists',
          message: 'Email must be unique'
        }
      }

      const clinicBranch = await prisma.clinicBranch.create({
        data: {
          name: validatedInput.name,
          address: validatedInput.address,
          phone: validatedInput.phone,
          email: validatedInput.email,
        }
      })

      return {
        success: true,
        data: {
          id: clinicBranch.id,
          name: clinicBranch.name,
          address: clinicBranch.address,
          phone: clinicBranch.phone,
          email: clinicBranch.email,
        },
        message: 'Clinic branch created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create clinic branch',
        message: 'Clinic branch creation failed'
      }
    }
  }

  /**
   * Get all clinic branches
   */
  static async getClinicBranches() {
    try {
      const clinicBranches = await prisma.clinicBranch.findMany({
        orderBy: { name: 'asc' }
      })

      return {
        success: true,
        data: clinicBranches,
        message: 'Clinic branches retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve clinic branches',
        message: 'Failed to get clinic branches'
      }
    }
  }

  /**
   * Get clinic branch by ID
   */
  static async getClinicBranchById(id: number) {
    try {
      const clinicBranch = await prisma.clinicBranch.findUnique({
        where: { id }
      })

      if (!clinicBranch) {
        return {
          success: false,
          error: 'Clinic branch not found',
          message: 'No clinic branch found with this ID'
        }
      }

      return {
        success: true,
        data: clinicBranch,
        message: 'Clinic branch retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retrieve clinic branch',
        message: 'Failed to get clinic branch'
      }
    }
  }
}
