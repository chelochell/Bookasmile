import { auth } from '@/auth'
import { z } from 'zod'

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
}
