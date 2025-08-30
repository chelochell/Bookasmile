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
