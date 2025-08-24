import { useQuery } from '@tanstack/react-query'
import { dentistApi } from '@/lib/api/dentists'

// Query keys for React Query
export const dentistKeys = {
  all: ['dentists'] as const,
  lists: () => [...dentistKeys.all, 'list'] as const,
  list: (filters?: { clinicBranchId?: number }) => [...dentistKeys.lists(), { filters }] as const,
  details: () => [...dentistKeys.all, 'detail'] as const,
  detail: (id: string) => [...dentistKeys.details(), id] as const,
}

// Hook to fetch all dentists
export const useDentists = (params?: { clinicBranchId?: number }, enabled = true) => {
  return useQuery({
    queryKey: dentistKeys.list(params),
    queryFn: () => dentistApi.getAll(params),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dentists')
      }
      return data.data?.dentists || []
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to fetch a single dentist by ID
export const useDentist = (dentistId: string, enabled = true) => {
  return useQuery({
    queryKey: dentistKeys.detail(dentistId),
    queryFn: () => dentistApi.getById(dentistId),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dentist')
      }
      return data.data
    },
    enabled: enabled && !!dentistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
