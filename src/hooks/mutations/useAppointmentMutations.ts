import { useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentApi } from '@/lib/api/appointments'
import { appointmentKeys } from '@/hooks/queries/useAppointments'
import { CreateAppointmentInput, UpdateAppointmentInput } from '@/server/models/appointment.model'
import { toast } from 'react-toastify'

// Create appointment mutation
export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppointmentInput) => appointmentApi.create(data),
    onSuccess: (data) => {
      // Invalidate and refetch all appointment lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      
      // Don't show automatic success toasts - let the component handle it
      if (!data.success) {
        console.error('Appointment creation failed:', data.error)
      }
    },
    onError: (error: Error) => {
      console.error('Appointment mutation error:', error)
      // Don't show automatic error toasts - let the component handle it
    },
  })
}

// Update appointment mutation
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateAppointmentInput) => appointmentApi.update(data),
    onSuccess: (data, variables) => {
      // Invalidate specific appointment detail
      if (variables.appointmentId) {
        queryClient.invalidateQueries({ 
          queryKey: appointmentKeys.detail(variables.appointmentId) 
        })
      }
      
      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Appointment updated successfully')
      } else {
        toast.error(data.error || 'Failed to update appointment')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update appointment')
    },
  })
}

// Delete appointment mutation
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentId: string) => appointmentApi.delete(appointmentId),
    onSuccess: (data, appointmentId) => {
      // Remove specific appointment from cache
      queryClient.removeQueries({ 
        queryKey: appointmentKeys.detail(appointmentId) 
      })
      
      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      
      if (data.success) {
        toast.success(data.message || 'Appointment deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete appointment')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete appointment')
    },
  })
}

// Combined hook for all appointment mutations
export const useAppointmentMutations = () => {
  const createMutation = useCreateAppointment()
  const updateMutation = useUpdateAppointment()
  const deleteMutation = useDeleteAppointment()

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  }
} 