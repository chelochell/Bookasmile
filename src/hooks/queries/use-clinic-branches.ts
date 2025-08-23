import { useQuery } from '@tanstack/react-query'
import { clinicBranchApi } from '@/lib/api/clinic-branches'

// Query keys for React Query
export const clinicBranchKeys = {
  all: ['clinic-branches'] as const,
  lists: () => [...clinicBranchKeys.all, 'list'] as const,
  list: () => [...clinicBranchKeys.lists()] as const,
  details: () => [...clinicBranchKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...clinicBranchKeys.details(), id] as const,
}

// Hook to fetch all clinic branches
export const useClinicBranches = (enabled = true) => {
  return useQuery({
    queryKey: clinicBranchKeys.list(),
    queryFn: () => clinicBranchApi.getAll(),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch clinic branches')
      }
      return data.data || []
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

// Hook to fetch a single clinic branch by ID
export const useClinicBranch = (branchId: string | number, enabled = true) => {
  return useQuery({
    queryKey: clinicBranchKeys.detail(branchId),
    queryFn: () => clinicBranchApi.getById(branchId),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch clinic branch')
      }
      return data.data
    },
    enabled: enabled && !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to get clinic branches count
export const useClinicBranchesCount = (enabled = true) => {
  const { data: branches, isLoading, error } = useClinicBranches(enabled)
  
  return {
    count: branches?.length || 0,
    isLoading,
    error
  }
}
