// Query hooks
export * from './queries/use-appointments'
export * from './queries/use-clinic-branches'
export * from './queries/useAvailability'
export * from './queries/use-notifications'

// Mutation hooks  
export * from './mutations/use-appointment-mutations'
export * from './mutations/use-clinic-branch-mutations'
export * from './mutations/useAvailabilityMutations'
export * from './mutations/use-notification-mutations'

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
} from './queries/use-appointments'

export {
  useCreateAppointment,
  useUpdateAppointment, 
  useDeleteAppointment,
  useAppointmentMutations
} from './mutations/use-appointment-mutations'

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

// Re-export for convenience - Notifications
export {
  useNotifications,
  useUserNotifications,
  useUnreadNotificationCount,
  useNotification,
  useUnreadNotifications,
  useReadNotifications
} from './queries/use-notifications'

export {
  useCreateNotification,
  useUpdateNotification,
  useMarkNotificationsAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification
} from './mutations/use-notification-mutations' 