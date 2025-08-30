'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, User, Plus, Search, CalendarDays, Stethoscope, MapPin, Building2, Settings, Eye, CheckCircle, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DentalFormDialog from '@/components/atoms/dental-form-dialog'
import { ConfirmationDialog, useConfirmationDialog } from '@/components/atoms/confirmation-dialog'
import { AppointmentWithRelations } from '@/server/models/appointment.model'
import { formatPhilippineDateTime, formatPhilippineDate, formatPhilippineTime, isToday } from '@/utils/timezone'
import { useConfirmAppointment, useDeleteAppointment } from '@/hooks/mutations/use-appointment-management-mutations'
import { useAppointments } from '@/hooks/queries/use-appointments'
import { Skeleton } from '@/components/ui/skeleton'

import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface SecretaryDashboardProps {
  // No props needed - we'll fetch data using useQuery
}

const SecretaryDashboard = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<string>('today')

  // Fetch all appointments for secretary dashboard
  const { 
    data: appointments = [], 
    isLoading, 
    isError, 
    error 
  } = useAppointments({ limit: 200 }) // Secretary can see all appointments

  // React Query mutations
  const confirmAppointmentMutation = useConfirmAppointment()
  const deleteAppointmentMutation = useDeleteAppointment()
  
  // Confirmation dialog state
  const deleteDialog = useConfirmationDialog()
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('')
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null)

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment: AppointmentWithRelations) => {
      const matchesSearch = search === '' || 
        appointment.notes?.toLowerCase().includes(search.toLowerCase()) ||
        appointment.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
        appointment.clinicBranch?.name?.toLowerCase().includes(search.toLowerCase()) ||
        appointment.treatmentOptions?.some((treatment: string) => 
          treatment.toLowerCase().includes(search.toLowerCase())
        )

      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter

      const appointmentDate = new Date(appointment.appointmentDate)
      const matchesTime = timeFilter === 'all' || 
        (timeFilter === 'today' && isToday(appointment.appointmentDate)) ||
        (timeFilter === 'upcoming' && new Date(appointment.appointmentDate) > new Date()) ||
        (timeFilter === 'past' && new Date(appointment.appointmentDate) < new Date())

      return matchesSearch && matchesStatus && matchesTime
    })
  }, [appointments, search, statusFilter, timeFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      confirmed: { variant: "default" as const, className: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { variant: "secondary" as const, className: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200" },
      rescheduled: { variant: "secondary" as const, className: "bg-purple-100 text-purple-800 border-purple-200" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant} className={`${config.className} font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDateTime = (dateStr: string, timeStr: string) => {
    // Format date in Philippine time
    const date = formatPhilippineDate(dateStr, 'MMM DD, YYYY')
    const time = formatPhilippineTime(timeStr, 'h:mm A')
    
    let dateLabel = date
    if (isToday(dateStr)) {
      dateLabel = `Today, ${formatPhilippineDate(dateStr, 'MMM DD')}`
    }
    
    return { date: dateLabel, time }
  }

  const getAppointmentIcon = (treatments: string[]) => {
    if (treatments?.includes('cleaning')) return <Calendar className="w-5 h-5 text-blue-500" />
    if (treatments?.includes('consultation')) return <User className="w-5 h-5 text-green-500" />
    if (treatments?.includes('surgery')) return <Stethoscope className="w-5 h-5 text-red-500" />
    return <CalendarDays className="w-5 h-5 text-gray-500" />
  }

  const todayAppointments = appointments.filter((apt: AppointmentWithRelations) => isToday(apt.appointmentDate))
  const upcomingAppointments = appointments.filter((apt: AppointmentWithRelations) => 
    new Date(apt.appointmentDate) > new Date() && !isToday(apt.appointmentDate)
  )
  const pendingAppointments = appointments.filter((apt: AppointmentWithRelations) => apt.status === 'pending')

  // Handler functions
  const handleConfirmAppointment = (appointmentId: string) => {
    confirmAppointmentMutation.mutate({ appointmentId })
  }

  const handleDeleteAppointment = (appointmentId: string) => {
    const appointment = appointments.find((apt: AppointmentWithRelations) => apt.appointmentId === appointmentId)
    if (appointment) {
      setSelectedAppointmentId(appointmentId)
      setSelectedAppointment(appointment)
      deleteDialog.openDialog()
    }
  }

  const confirmDeleteAppointment = async () => {
    if (selectedAppointmentId) {
      deleteAppointmentMutation.mutate({ appointmentId: selectedAppointmentId })
      setSelectedAppointmentId('')
      setSelectedAppointment(null)
    }
  }

  const handleViewAppointment = (appointmentId: string) => {
    // Placeholder for view functionality
    toast.info('View appointment functionality coming soon')
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    // Placeholder for reschedule functionality
    toast.info('Reschedule appointment functionality coming soon')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="bg-primary rounded-xl shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>

          {/* Filters Skeleton */}
          <Skeleton className="h-20" />

          {/* Appointments List Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-lg text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <p className="font-medium">Failed to load appointments</p>
              <p className="text-sm">{error?.message || 'Unknown error occurred'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-primary rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Secretary Dashboard</h1>
              <p className="text-primary-foreground">Manage all clinic appointments and patient schedules</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => router.push('/appointment/new')}
                className="bg-white hover:bg-gray-100 text-primary font-medium px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Book Appointment
              </Button>
              <Button 
                onClick={() => router.push('/appointment/secretary')}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary font-medium px-6 py-3 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Manage Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-xl font-bold text-foreground">{todayAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-xl font-bold text-foreground">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold text-foreground">{pendingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-foreground">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by patient name, clinic branch, treatment, or notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 border-border focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-border">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full sm:w-48 border-border">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No appointments found</h3>
              <p className="text-muted-foreground mb-6">
                {search || statusFilter !== 'all' || timeFilter !== 'all' 
                  ? 'Try adjusting your filters to see more appointments.'
                  : 'No appointments scheduled yet.'
                }
              </p>
              <Button 
                onClick={() => router.push('/appointment/new')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment: AppointmentWithRelations) => {
              const { date, time } = formatDateTime(appointment.appointmentDate, appointment.startTime)
              
              return (
                <Card key={appointment.appointmentId} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Icon & Treatment */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-muted p-3 rounded-lg">
                          {getAppointmentIcon(appointment.treatmentOptions || [])}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {appointment.treatmentOptions?.map((t: string) => 
                              t.charAt(0).toUpperCase() + t.slice(1)
                            ).join(', ') || 'General Appointment'}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{appointment.patient?.name || `Patient ID: ${appointment.patientId}`}</span>
                          </div>
                          {appointment.clinicBranch && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="w-4 h-4" />
                              <span>{appointment.clinicBranch.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-foreground">{date}</p>
                          <p className="text-muted-foreground">{time}</p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status || 'pending')}
                        <DentalFormDialog 
                          detailedNotes={appointment.detailedNotes || ''} 
                          patientId={appointment.patient?.name || appointment.patientId}
                          appointmentId={appointment.appointmentId}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-border hover:border-border/80"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleViewAppointment(appointment.appointmentId || '')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleConfirmAppointment(appointment.appointmentId || '')}
                              disabled={appointment.status === 'confirmed' || confirmAppointmentMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {confirmAppointmentMutation.isPending ? 'Confirming...' : 'Confirm Appointment'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleRescheduleAppointment(appointment.appointmentId || '')}
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reschedule Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-destructive"
                              onClick={() => handleDeleteAppointment(appointment.appointmentId || '')}
                              disabled={deleteAppointmentMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {deleteAppointmentMutation.isPending ? 'Deleting...' : 'Delete Appointment'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => {
          deleteDialog.closeDialog()
          setSelectedAppointmentId('')
          setSelectedAppointment(null)
        }}
        onConfirm={confirmDeleteAppointment}
        title="Delete Appointment"
        description={
          selectedAppointment
            ? `Are you sure you want to delete the appointment for ${selectedAppointment.patient?.name || 'this patient'} on ${formatPhilippineDate(selectedAppointment.appointmentDate, 'MMM DD, YYYY')} at ${formatPhilippineTime(selectedAppointment.startTime, 'h:mm A')}? This action cannot be undone.`
            : 'Are you sure you want to delete this appointment? This action cannot be undone.'
        }
        confirmText="Delete Appointment"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

export default SecretaryDashboard
