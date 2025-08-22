// Query hooks
export * from './queries/useAppointments'

// Mutation hooks  
export * from './mutations/useAppointmentMutations'

// Re-export for convenience
export { 
  useAppointments,
  useAppointment,
  usePatientAppointments,
  useDentistAppointments,
  useAppointmentsByDateRange,
  useAppointmentsByStatus,
  usePendingAppointments,
  useConfirmedAppointments,
  useCompletedAppointments,
  useCancelledAppointments,
  appointmentKeys
} from './queries/useAppointments'

export {
  useCreateAppointment,
  useUpdateAppointment, 
  useDeleteAppointment,
  useAppointmentMutations
} from './mutations/useAppointmentMutations' 