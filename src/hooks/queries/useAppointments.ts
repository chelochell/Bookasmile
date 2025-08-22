import { useQuery } from '@tanstack/react-query'
import { appointmentApi } from '@/lib/api/appointments'
import { AppointmentQueryParams } from '@/server/models/appointment.model'

// Query keys for React Query
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters?: Partial<AppointmentQueryParams>) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
}

// Hook to fetch all appointments with optional filtering
export const useAppointments = (params?: Partial<AppointmentQueryParams>) => {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => appointmentApi.getAll(params),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch appointments')
      }
      return data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single appointment by ID
export const useAppointment = (appointmentId: string, enabled = true) => {
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: () => appointmentApi.getById(appointmentId),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch appointment')
      }
      return data.data
    },
    enabled: enabled && !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch appointments for a specific patient
export const usePatientAppointments = (patientId: string, enabled = true) => {
  return useAppointments({ patientId, limit: 50 })
}

// Hook to fetch appointments for a specific dentist
export const useDentistAppointments = (dentistId: string, enabled = true) => {
  return useAppointments({ dentistId, limit: 50 })
}

// Hook to fetch appointments within a date range
export const useAppointmentsByDateRange = (
  startDate: string, 
  endDate: string, 
  enabled = true
) => {
  return useAppointments({ startDate, endDate, limit: 100 })
}

// Hook to fetch appointments by status
export const useAppointmentsByStatus = (status: string, enabled = true) => {
  return useAppointments({ status: status as any, limit: 50 })
}

// Hook to fetch pending appointments
export const usePendingAppointments = (enabled = true) => {
  return useAppointmentsByStatus('pending', enabled)
}

// Hook to fetch confirmed appointments
export const useConfirmedAppointments = (enabled = true) => {
  return useAppointmentsByStatus('confirmed', enabled)
}

// Hook to fetch completed appointments
export const useCompletedAppointments = (enabled = true) => {
  return useAppointmentsByStatus('completed', enabled)
}

// Hook to fetch cancelled appointments
export const useCancelledAppointments = (enabled = true) => {
  return useAppointmentsByStatus('cancelled', enabled)
} 