import { z } from 'zod'

// Gender options
const genderOptions = [
  'male',
  'female',
  'other',
  'prefer-not-to-say'
] as const

// Emergency contact relationship options
const relationshipOptions = [
  'spouse',
  'parent',
  'child',
  'sibling',
  'relative',
  'friend',
  'guardian',
  'other'
] as const

// Base basic user information schema for validation
export const basicUserInformationSchema = z.object({
  id: z.cuid().optional(),
  userId: z.string({ message: 'Invalid user ID' }),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  middleInitial: z.string().max(5, 'Middle initial must be 5 characters or less').optional(),
  birthDate: z.string().refine((date) => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime()) && parsedDate <= new Date()
  }, {
    message: 'Invalid birth date or birth date cannot be in the future'
  }),
  gender: z.enum(genderOptions, {
    message: 'Invalid gender selection'
  }),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be 15 digits or less')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number format'),
  address: z.string().min(5, 'Address is required').max(200, 'Address must be 200 characters or less'),
  region: z.string().min(1, 'Region is required').max(100, 'Region must be 100 characters or less'),
  province: z.string().min(1, 'Province is required').max(100, 'Province must be 100 characters or less'),
  city: z.string().min(1, 'City is required').max(100, 'City must be 100 characters or less'),
  barangay: z.string().min(1, 'Barangay is required').max(100, 'Barangay must be 100 characters or less'),
  zipCode: z.string()
    .min(4, 'ZIP code must be at least 4 digits')
    .max(10, 'ZIP code must be 10 characters or less')
    .regex(/^[0-9]+$/, 'ZIP code must contain only numbers'),
  country: z.string().min(1, 'Country is required').max(50, 'Country must be 50 characters or less').default('Philippines'),
  emergencyContactName: z.string().max(100, 'Emergency contact name must be 100 characters or less').optional(),
  emergencyContactPhoneNumber: z.string()
    .max(15, 'Emergency contact phone number must be 15 digits or less')
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid emergency contact phone number format')
    .optional(),
  emergencyContactRelationship: z.enum(relationshipOptions, {
    message: 'Invalid relationship selection'
  }).optional(),
})

// Schema for creating basic user information
export const createBasicUserInformationSchema = basicUserInformationSchema.omit({
  id: true,
})

// Schema for updating basic user information
export const updateBasicUserInformationSchema = basicUserInformationSchema.partial().required({
  userId: true,
})

// Schema for basic user information query parameters
export const basicUserInformationQuerySchema = z.object({
  userId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
})

// Type exports
export type CreateBasicUserInformationInput = z.infer<typeof createBasicUserInformationSchema>
export type UpdateBasicUserInformationInput = z.infer<typeof updateBasicUserInformationSchema>
export type BasicUserInformationQueryParams = z.infer<typeof basicUserInformationQuerySchema>
export type BasicUserInformationData = z.infer<typeof basicUserInformationSchema>

// Extended type with related data for display purposes
export type BasicUserInformationWithUser = BasicUserInformationData & {
  user?: {
    id: string
    name: string
    email: string
    image?: string
  }
}

// Enums
export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer-not-to-say',
}

export enum RelationshipEnum {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  RELATIVE = 'relative',
  FRIEND = 'friend',
  GUARDIAN = 'guardian',
  OTHER = 'other',
}

// Helper function to get gender display names
export const getGenderDisplayName = (gender: string): string => {
  const displayNames: Record<string, string> = {
    'male': 'Male',
    'female': 'Female',
    'other': 'Other',
    'prefer-not-to-say': 'Prefer not to say',
  }
  return displayNames[gender] || gender
}

// Helper function to get relationship display names
export const getRelationshipDisplayName = (relationship: string): string => {
  const displayNames: Record<string, string> = {
    'spouse': 'Spouse',
    'parent': 'Parent',
    'child': 'Child',
    'sibling': 'Sibling',
    'relative': 'Relative',
    'friend': 'Friend',
    'guardian': 'Guardian',
    'other': 'Other',
  }
  return displayNames[relationship] || relationship
}
