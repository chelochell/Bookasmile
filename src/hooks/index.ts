// Query hooks
export * from './queries/useAppointments'
export * from './queries/use-clinic-branches'
export * from './queries/useAvailability'

// Mutation hooks  
export * from './mutations/useAppointmentMutations'
export * from './mutations/use-clinic-branch-mutations'
export * from './mutations/useAvailabilityMutations'

// Re-export for convenience - Appointments
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

// Re-export for convenience - Clinic Branches
export {
  useClinicBranches,
  useClinicBranch,
  useClinicBranchesCount,
  clinicBranchKeys
} from './queries/use-clinic-branches'

export {
  useCreateClinicBranch,
  useClinicBranchMutations
} from './mutations/use-clinic-branch-mutations' 