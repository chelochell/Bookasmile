import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dentistAvailabilityApi, specificDentistAvailabilityApi } from '@/lib/api/availability'
import { availabilityKeys } from '@/hooks/queries/useAvailability'
import { 
  CreateDentistAvailabilityInput, 
  UpdateDentistAvailabilityInput,
  CreateSpecificDentistAvailabilityInput,
  UpdateSpecificDentistAvailabilityInput
} from '@/server/models/availability.model'
import { toast } from 'react-toastify'

// ==================== DENTIST AVAILABILITY MUTATIONS ====================

// Create dentist availability mutation
export function useCreateDentistAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDentistAvailabilityInput) => dentistAvailabilityApi.create(data),
    onSuccess: (data) => {
      // Invalidate and refetch all dentist availability lists
      queryClient.invalidateQueries({ queryKey: availabilityKeys.dentistAvailability.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Availability created successfully')
      } else {
        toast.error(data.error || 'Failed to create availability')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create availability')
    },
  })
}

// Update dentist availability mutation
export function useUpdateDentistAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateDentistAvailabilityInput) => dentistAvailabilityApi.update(data),
    onSuccess: (data, variables) => {
      // Invalidate specific availability detail
      if (variables.id) {
        queryClient.invalidateQueries({ 
          queryKey: availabilityKeys.dentistAvailability.detail(variables.id) 
        })
      }
      
      // Invalidate all dentist availability lists
      queryClient.invalidateQueries({ queryKey: availabilityKeys.dentistAvailability.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Availability updated successfully')
      } else {
        toast.error(data.error || 'Failed to update availability')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update availability')
    },
  })
}

// Delete dentist availability mutation
export function useDeleteDentistAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => dentistAvailabilityApi.delete(id),
    onSuccess: (data, variables) => {
      // Invalidate specific availability detail
      queryClient.invalidateQueries({ 
        queryKey: availabilityKeys.dentistAvailability.detail(variables) 
      })
      
      // Invalidate all dentist availability lists
      queryClient.invalidateQueries({ queryKey: availabilityKeys.dentistAvailability.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Availability deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete availability')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete availability')
    },
  })
}

// ==================== SPECIFIC DENTIST AVAILABILITY MUTATIONS ====================

// Create specific dentist availability mutation
export function useCreateSpecificDentistAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSpecificDentistAvailabilityInput) => specificDentistAvailabilityApi.create(data),
    onSuccess: (data) => {
      // Invalidate and refetch all specific availability lists
      queryClient.invalidateQueries({ queryKey: availabilityKeys.specificAvailability.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Specific availability created successfully')
      } else {
        toast.error(data.error || 'Failed to create specific availability')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create specific availability')
    },
  })
}

// Update specific dentist availability mutation
export function useUpdateSpecificDentistAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSpecificDentistAvailabilityInput) => specificDentistAvailabilityApi.update(data),
    onSuccess: (data, variables) => {
      // Invalidate specific availability detail
      if (variables.id) {
        queryClient.invalidateQueries({ 
          queryKey: availabilityKeys.specificAvailability.detail(variables.id) 
        })
      }
      
      // Invalidate all specific availability lists
      queryClient.invalidateQueries({ queryKey: availabilityKeys.specificAvailability.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Specific availability updated successfully')
      } else {
        toast.error(data.error || 'Failed to update specific availability')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update specific availability')
    },
  })
}

// Delete specific dentist availability mutation
export function useDeleteSpecificDentistAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => specificDentistAvailabilityApi.delete(id),
    onSuccess: (data, variables) => {
      // Invalidate specific availability detail
      queryClient.invalidateQueries({ 
        queryKey: availabilityKeys.specificAvailability.detail(variables) 
      })
      
      // Invalidate all specific availability lists
      queryClient.invalidateQueries({ queryKey: availabilityKeys.specificAvailability.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Specific availability deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete specific availability')
        // Throw error to trigger onError and make the promise reject
        throw new Error(data.error || 'Failed to delete specific availability')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete specific availability')
    },
  })
}

// ==================== COMBINED HOOKS ====================

// Combined hook for all dentist availability mutations
export function useDentistAvailabilityMutations() {
  const createMutation = useCreateDentistAvailability()
  const updateMutation = useUpdateDentistAvailability()
  const deleteMutation = useDeleteDentistAvailability()

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  }
}

// Combined hook for all specific dentist availability mutations
export function useSpecificDentistAvailabilityMutations() {
  const createMutation = useCreateSpecificDentistAvailability()
  const updateMutation = useUpdateSpecificDentistAvailability()
  const deleteMutation = useDeleteSpecificDentistAvailability()

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  }
}
