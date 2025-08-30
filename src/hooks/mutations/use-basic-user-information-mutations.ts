import { useMutation, useQueryClient } from '@tanstack/react-query'
import { basicUserInformationApi } from '@/lib/api/basic-user-information'
import { basicUserInformationKeys } from '@/hooks/queries/use-basic-user-information'
import { toast } from 'sonner'
import {
  CreateBasicUserInformationInput,
  UpdateBasicUserInformationInput,
} from '@/server/models/basic-user-information.model'

// Hook to create basic user information
export const useCreateBasicUserInformation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBasicUserInformationInput) => basicUserInformationApi.create(data),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate and refetch basic user information queries
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.all })
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.userDetail(variables.userId) })
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.userCheck(variables.userId) })
        
        toast.success(data.message || 'Basic information created successfully')
      } else {
        toast.error(data.error || 'Failed to create basic information')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create basic information')
    },
  })
}

// Hook to update basic user information
export const useUpdateBasicUserInformation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UpdateBasicUserInformationInput> }) => 
      basicUserInformationApi.update(userId, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate and refetch basic user information queries
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.all })
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.userDetail(variables.userId) })
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.userCheck(variables.userId) })
        
        toast.success(data.message || 'Basic information updated successfully')
      } else {
        toast.error(data.error || 'Failed to update basic information')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update basic information')
    },
  })
}

// Hook to delete basic user information
export const useDeleteBasicUserInformation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => basicUserInformationApi.delete(userId),
    onSuccess: (data, userId) => {
      if (data.success) {
        // Invalidate and refetch basic user information queries
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.all })
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.userDetail(userId) })
        queryClient.invalidateQueries({ queryKey: basicUserInformationKeys.userCheck(userId) })
        
        toast.success(data.message || 'Basic information deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete basic information')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete basic information')
    },
  })
}
