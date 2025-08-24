import { z } from 'zod'

// Common specialization options (you can extend this list)
const specializationOptions = [
  'general-dentistry',
  'orthodontics',
  'periodontics',
  'endodontics',
  'oral-surgery',
  'prosthodontics',
  'pediatric-dentistry',
  'oral-pathology',
  'oral-radiology',
  'cosmetic-dentistry',
  'implantology',
  'maxillofacial-surgery'
] as const

// Base dentist schema for validation
export const dentistSchema = z.object({
  id: z.cuid().optional(),
  userId: z.string({ message: 'Invalid user ID' }),
  specialization: z.array(z.enum(specializationOptions, {
    message: 'Invalid specialization'
  })).min(1, 'At least one specialization is required'),
})

// Schema for creating a new dentist
export const createDentistSchema = dentistSchema.omit({
  id: true,
})

// Schema for updating a dentist
export const updateDentistSchema = dentistSchema.partial().required({
  id: true,
})

// Schema for dentist query parameters
export const dentistQuerySchema = z.object({
  userId: z.string().optional(),
  specialization: z.enum(specializationOptions).optional(),
  includeAvailability: z.string().transform(val => val === 'true').optional(),
  includeUser: z.string().transform(val => val === 'true').optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
})

// Type exports
export type CreateDentistInput = z.infer<typeof createDentistSchema>
export type UpdateDentistInput = z.infer<typeof updateDentistSchema>
export type DentistQueryParams = z.infer<typeof dentistQuerySchema>
export type DentistData = z.infer<typeof dentistSchema>

// Enums
export enum SpecializationEnum {
  GENERAL_DENTISTRY = 'general-dentistry',
  ORTHODONTICS = 'orthodontics',
  PERIODONTICS = 'periodontics',
  ENDODONTICS = 'endodontics',
  ORAL_SURGERY = 'oral-surgery',
  PROSTHODONTICS = 'prosthodontics',
  PEDIATRIC_DENTISTRY = 'pediatric-dentistry',
  ORAL_PATHOLOGY = 'oral-pathology',
  ORAL_RADIOLOGY = 'oral-radiology',
  COSMETIC_DENTISTRY = 'cosmetic-dentistry',
  IMPLANTOLOGY = 'implantology',
  MAXILLOFACIAL_SURGERY = 'maxillofacial-surgery',
}

// Helper function to get specialization display names
export const getSpecializationDisplayName = (specialization: string): string => {
  const displayNames: Record<string, string> = {
    'general-dentistry': 'General Dentistry',
    'orthodontics': 'Orthodontics',
    'periodontics': 'Periodontics',
    'endodontics': 'Endodontics',
    'oral-surgery': 'Oral Surgery',
    'prosthodontics': 'Prosthodontics',
    'pediatric-dentistry': 'Pediatric Dentistry',
    'oral-pathology': 'Oral Pathology',
    'oral-radiology': 'Oral Radiology',
    'cosmetic-dentistry': 'Cosmetic Dentistry',
    'implantology': 'Implantology',
    'maxillofacial-surgery': 'Maxillofacial Surgery',
  }
  return displayNames[specialization] || specialization
}
