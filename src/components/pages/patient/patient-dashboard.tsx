'use client'

import { usePatientAppointments } from '@/hooks/queries/use-appointments'
import UpcomingAppointmentsCard from '@/components/organisms/upcoming-appointments-card'
import QuickActions from '@/components/organisms/quick-actions'
import { Skeleton } from '@/components/ui/skeleton'

import { AlertTriangle } from 'lucide-react'

interface PatientDashboardProps {
  userId: string
}

export default function PatientDashboard({ userId }: PatientDashboardProps) {
  const { 
    data: appointments = [], 
    isLoading, 
    isError, 
    error 
  } = usePatientAppointments(userId, !!userId)

  if (isLoading) {
    return (
      <div className='flex gap-8'>
        <div className="w-full max-w-md">
          <Skeleton className="h-8 w-48 mb-2" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="w-full max-w-md">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-lg text-red-800">
        <AlertTriangle className="h-4 w-4" />
        <div>
          <p className="font-medium">Failed to load appointments</p>
          <p className="text-sm">{error?.message || 'Unknown error occurred'}</p>
        </div>
      </div>
    )
  }

  // Format appointments for UpcomingAppointmentsCard
  const upcomingAppointmentsProps = appointments.map((appointment) => ({
    appointmentId: appointment.appointmentId,
    appointmentDate: appointment.appointmentDate,
    startTime: appointment.startTime,
    treatmentOptions: appointment.treatmentOptions,
    status: appointment.status,
    dentist: appointment.dentist,
    notes: appointment.notes
  }))

  return (
    <div className='flex gap-8'>
      {upcomingAppointmentsProps.length > 0 && (
        <UpcomingAppointmentsCard appointments={upcomingAppointmentsProps} />
      )}
      <QuickActions />
    </div>
  )
}
