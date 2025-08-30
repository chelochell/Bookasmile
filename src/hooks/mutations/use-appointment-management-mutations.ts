'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AppointmentWithRelations } from '@/server/models/appointment.model'

interface ConfirmAppointmentParams {
  appointmentId: string
}

interface DeleteAppointmentParams {
  appointmentId: string
}

interface RescheduleAppointmentParams {
  appointmentId: string
  newDate: string
  newStartTime: string
  newEndTime?: string
}

interface AssignDentistParams {
  appointmentId: string
  dentistId: string
}

interface CancelAppointmentParams {
  appointmentId: string
}

interface ResetStatusParams {
  appointmentId: string
}

// Confirm appointment mutation
export function useConfirmAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ appointmentId }: ConfirmAppointmentParams) => {
      const response = await fetch(`/api/appointments/${appointmentId}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to confirm appointment')
      }

      return response.json()
    },
    onMutate: async ({ appointmentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointments'] })

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueryData(['appointments'])

      // Optimistically update to the new value
      queryClient.setQueryData(['appointments'], (old: any) => {
        if (!old?.data?.data?.appointments) return old
        
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              appointments: old.data.data.appointments.map((appointment: AppointmentWithRelations) =>
                appointment.appointmentId === appointmentId
                  ? { ...appointment, status: 'confirmed' }
                  : appointment
              )
            }
          }
        }
      })
      return { previousAppointments }
    },
    onError: (error, { appointmentId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments'], context.previousAppointments)
      }
      toast.error(error.message || 'Failed to confirm appointment')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment confirmed successfully')
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

// Delete appointment mutation
export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ appointmentId }: DeleteAppointmentParams) => {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete appointment')
      }

      return response.json()
    },
    onMutate: async ({ appointmentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointments'] })

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueryData(['appointments'])

      // Optimistically remove the appointment
      queryClient.setQueryData(['appointments'], (old: any) => {
        if (!old?.data?.data?.appointments) return old
        
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              appointments: old.data.data.appointments.filter(
                (appointment: AppointmentWithRelations) => appointment.appointmentId !== appointmentId
              )
            }
          }
        }
      })

      return { previousAppointments }
    },
    onError: (error, { appointmentId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments'], context.previousAppointments)
      }
      toast.error(error.message || 'Failed to delete appointment')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment deleted successfully')
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

// Reschedule appointment mutation
export function useRescheduleAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ appointmentId, newDate, newStartTime, newEndTime }: RescheduleAppointmentParams) => {
      const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newDate,
          newStartTime,
          newEndTime,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reschedule appointment')
      }

      return response.json()
    },
    onMutate: async ({ appointmentId, newDate, newStartTime, newEndTime }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointments'] })

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueryData(['appointments'])

      // Optimistically update the appointment
      queryClient.setQueryData(['appointments'], (old: any) => {
        if (!old?.data?.data?.appointments) return old
        
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              appointments: old.data.data.appointments.map((appointment: AppointmentWithRelations) =>
                appointment.appointmentId === appointmentId
                  ? { 
                      ...appointment, 
                      status: 'rescheduled',
                      appointmentDate: new Date(newDate),
                      startTime: new Date(newStartTime),
                      endTime: newEndTime ? new Date(newEndTime) : appointment.endTime
                    }
                  : appointment
              )
            }
          }
        }
      })

      return { previousAppointments }
    },
    onError: (error, { appointmentId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments'], context.previousAppointments)
      }
      toast.error(error.message || 'Failed to reschedule appointment')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment rescheduled successfully')
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

// Assign dentist to appointment mutation
export function useAssignDentist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ appointmentId, dentistId }: AssignDentistParams) => {
      const response = await fetch(`/api/appointments/${appointmentId}/assign-dentist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dentistId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to assign dentist')
      }

      return response.json()
    },
    onMutate: async ({ appointmentId, dentistId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointments'] })

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueryData(['appointments'])

      // Optimistically update the appointment
      queryClient.setQueryData(['appointments'], (old: any) => {
        if (!old?.data?.appointments) return old
        
        return {
          ...old,
          data: {
            ...old.data,
            appointments: old.data.appointments.map((appointment: AppointmentWithRelations) =>
              appointment.appointmentId === appointmentId
                ? { 
                    ...appointment, 
                    dentistId: dentistId,
                    dentist: { 
                      id: dentistId,
                      user: { name: 'Assigning...' } // Placeholder until refresh
                    }
                  }
                : appointment
            )
          }
        }
      })

      return { previousAppointments }
    },
    onError: (error, { appointmentId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments'], context.previousAppointments)
      }
      toast.error(error.message || 'Failed to assign dentist')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Dentist assigned successfully')
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

// Cancel appointment mutation
export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ appointmentId }: CancelAppointmentParams) => {
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to cancel appointment')
      }

      return response.json()
    },
    onMutate: async ({ appointmentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointments'] })

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueryData(['appointments'])

      // Optimistically update to the new value
      queryClient.setQueryData(['appointments'], (old: any) => {
        if (!old?.data?.data?.appointments) return old
        
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              appointments: old.data.data.appointments.map((appointment: AppointmentWithRelations) =>
                appointment.appointmentId === appointmentId
                  ? { ...appointment, status: 'cancelled' }
                  : appointment
              )
            }
          }
        }
      })
      return { previousAppointments }
    },
    onError: (error, { appointmentId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments'], context.previousAppointments)
      }
      toast.error(error.message || 'Failed to cancel appointment')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment cancelled successfully')
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

// Reset appointment status to pending mutation
export function useResetAppointmentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ appointmentId }: ResetStatusParams) => {
      const response = await fetch(`/api/appointments/${appointmentId}/reset-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reset appointment status')
      }

      return response.json()
    },
    onMutate: async ({ appointmentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointments'] })

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueryData(['appointments'])

      // Optimistically update to the new value
      queryClient.setQueryData(['appointments'], (old: any) => {
        if (!old?.data?.data?.appointments) return old
        
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              appointments: old.data.data.appointments.map((appointment: AppointmentWithRelations) =>
                appointment.appointmentId === appointmentId
                  ? { ...appointment, status: 'pending' }
                  : appointment
              )
            }
          }
        }
      })
      return { previousAppointments }
    },
    onError: (error, { appointmentId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments'], context.previousAppointments)
      }
      toast.error(error.message || 'Failed to reset appointment status')
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment status reset to pending successfully')
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
