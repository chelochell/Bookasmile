import { z } from 'zod'

// Base clinic branch schema for validation
export const clinicBranchSchema = z.object({
  id: z.cuid().optional(),
  name: z.string().min(1, 'Clinic branch name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email format'),
})

// Schema for creating a new clinic branch
export const createClinicBranchSchema = clinicBranchSchema.omit({
  id: true,
})

// Schema for updating a clinic branch
export const updateClinicBranchSchema = clinicBranchSchema.partial().required({
  id: true,
})

// Type exports
export type CreateClinicBranchInput = z.infer<typeof createClinicBranchSchema>
export type UpdateClinicBranchInput = z.infer<typeof updateClinicBranchSchema>
export type ClinicBranchData = z.infer<typeof clinicBranchSchema>
