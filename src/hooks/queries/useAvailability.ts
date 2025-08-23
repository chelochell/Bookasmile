import { useQuery } from '@tanstack/react-query'
import { dentistApi, dentistAvailabilityApi, specificDentistAvailabilityApi } from '@/lib/api/availability'
import { 
  DentistAvailabilityQueryParams, 
  SpecificDentistAvailabilityQueryParams 
} from '@/server/models/availability.model'

// Query keys for React Query
export const availabilityKeys = {
  all: ['availability'] as const,
  dentist: {
    all: ['dentist'] as const,
    details: () => ['dentist', 'detail'] as const,
    detail: (userId: string) => ['dentist', 'detail', userId] as const,
  },
  dentistAvailability: {
    all: ['availability', 'dentist-availability'] as const,
    lists: () => ['availability', 'dentist-availability', 'list'] as const,
    list: (filters?: Partial<DentistAvailabilityQueryParams>) => ['availability', 'dentist-availability', 'list', { filters }] as const,
    details: () => ['availability', 'dentist-availability', 'detail'] as const,
    detail: (id: string) => ['availability', 'dentist-availability', 'detail', id] as const,
  },
  specificAvailability: {
    all: ['availability', 'specific-availability'] as const,
    lists: () => ['availability', 'specific-availability', 'list'] as const,
    list: (filters?: Partial<SpecificDentistAvailabilityQueryParams>) => ['availability', 'specific-availability', 'list', { filters }] as const,
    details: () => ['availability', 'specific-availability', 'detail'] as const,
    detail: (id: string) => ['availability', 'specific-availability', 'detail', id] as const,
  },
}

// Hook to fetch dentist by user ID
export function useDentistByUserId(userId: string, enabled = true) {
  return useQuery({
    queryKey: availabilityKeys.dentist.detail(userId),
    queryFn: () => dentistApi.getByUserId(userId),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dentist')
      }
      return data.data
    },
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to fetch all dentist availabilities with optional filtering
export function useDentistAvailabilities(params?: Partial<DentistAvailabilityQueryParams>) {
  return useQuery({
    queryKey: availabilityKeys.dentistAvailability.list(params),
    queryFn: () => dentistAvailabilityApi.getAll(params),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dentist availabilities')
      }
      return data.data.availabilities
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single dentist availability by ID
export function useDentistAvailability(id: string, enabled = true) {
  return useQuery({
    queryKey: availabilityKeys.dentistAvailability.detail(id),
    queryFn: () => dentistAvailabilityApi.getById(id),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dentist availability')
      }
      return data.data
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch all specific dentist availabilities with optional filtering
export function useSpecificDentistAvailabilities(params?: Partial<SpecificDentistAvailabilityQueryParams>) {
  return useQuery({
    queryKey: availabilityKeys.specificAvailability.list(params),
    queryFn: () => specificDentistAvailabilityApi.getAll(params),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch specific dentist availabilities')
      }
      return data.data.specificAvailabilities
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single specific dentist availability by ID
export function useSpecificDentistAvailability(id: string, enabled = true) {
  return useQuery({
    queryKey: availabilityKeys.specificAvailability.detail(id),
    queryFn: () => specificDentistAvailabilityApi.getById(id),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch specific dentist availability')
      }
      return data.data
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
