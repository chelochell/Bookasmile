import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clinicBranchApi } from '@/lib/api/clinic-branches'
import { clinicBranchKeys } from '@/hooks/queries/use-clinic-branches'
import { CreateClinicBranchInput } from '@/server/models/clinic-branch.model'
import { toast } from 'sonner'

// Create clinic branch mutation
export const useCreateClinicBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClinicBranchInput) => clinicBranchApi.create(data),
    onSuccess: (data) => {
      // Invalidate and refetch all clinic branch lists
      queryClient.invalidateQueries({ queryKey: clinicBranchKeys.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Clinic branch created successfully')
      } else {
        toast.error(data.error || 'Failed to create clinic branch')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create clinic branch')
    },
  })
}

// Combined hook for all clinic branch mutations (ready for future update/delete)
export const useClinicBranchMutations = () => {
  const createMutation = useCreateClinicBranch()

  return {
    create: createMutation,
    isLoading: createMutation.isPending,
  }
}
