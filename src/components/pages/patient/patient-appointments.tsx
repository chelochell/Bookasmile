'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format, isToday, isTomorrow, isPast, isFuture } from 'date-fns'
import { Calendar, Clock, User, Plus, Filter, Search, CalendarDays, Stethoscope, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePatientAppointments } from '@/hooks/queries/use-appointments'
import { Appointment } from '@/components/organisms/appointment-table/columns'
import { authClient } from '@/lib/auth-client'

const PatientAppointments = () => {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<string>('all')

  // Fetch patient appointments
  const { data: appointments = [], isLoading, error } = usePatientAppointments(
    session?.user?.id || '',
    !!session?.user?.id
  )

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment: Appointment) => {
      const matchesSearch = search === '' || 
        appointment.dentist?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        appointment.treatmentOptions.some(treatment => 
          treatment.toLowerCase().includes(search.toLowerCase())
        )

      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter

      const appointmentDate = new Date(appointment.appointmentDate)
      const matchesTime = timeFilter === 'all' || 
        (timeFilter === 'upcoming' && isFuture(appointmentDate)) ||
        (timeFilter === 'past' && isPast(appointmentDate)) ||
        (timeFilter === 'today' && isToday(appointmentDate)) ||
        (timeFilter === 'tomorrow' && isTomorrow(appointmentDate))

      return matchesSearch && matchesStatus && matchesTime
    })
  }, [appointments, search, statusFilter, timeFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      confirmed: { variant: "default" as const, className: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { variant: "secondary" as const, className: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant} className={`${config.className} font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr)
    const time = new Date(timeStr)
    
    let dateLabel = format(date, 'MMM dd, yyyy')
    if (isToday(date)) dateLabel = `Today, ${format(date, 'MMM dd')}`
    if (isTomorrow(date)) dateLabel = `Tomorrow, ${format(date, 'MMM dd')}`
    
    const timeLabel = format(time, 'h:mm a')
    return { date: dateLabel, time: timeLabel }
  }

  const getAppointmentIcon = (treatments: string[]) => {
    if (treatments.includes('cleaning')) return <Calendar className="w-5 h-5 text-blue-500" />
    if (treatments.includes('consultation')) return <User className="w-5 h-5 text-green-500" />
    if (treatments.includes('surgery')) return <Stethoscope className="w-5 h-5 text-red-500" />
    return <CalendarDays className="w-5 h-5 text-gray-500" />
  }

  const upcomingAppointments = filteredAppointments.filter((apt: Appointment) => 
    isFuture(new Date(apt.appointmentDate))
  )
  const pastAppointments = filteredAppointments.filter((apt: Appointment) => 
    isPast(new Date(apt.appointmentDate))
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your appointments...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-2">Failed to load appointments</p>
              <p className="text-gray-500">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-blue-500 rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Appointments</h1>
              <p className="text-white">Manage and view all your dental appointments</p>
            </div>
            <Button 
              onClick={() => router.push('/appointment/new')}
              className="bg-white hover:bg-blue-700 text-blue-500 font-medium px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Book New Appointment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {appointments.filter((apt: Appointment) => apt.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-gray-900">
                    {appointments.filter((apt: Appointment) => apt.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by dentist or treatment..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gray-200">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-6">
                {search || statusFilter !== 'all' || timeFilter !== 'all' 
                  ? 'Try adjusting your filters to see more appointments.'
                  : 'Get started by booking your first appointment.'
                }
              </p>
              <Button 
                onClick={() => router.push('/appointment/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment: Appointment) => {
              const { date, time } = formatDateTime(appointment.appointmentDate, appointment.startTime)
              const dentistName = appointment.dentist?.user?.name || 'Dentist TBD'
              const initials = dentistName.split(' ').map(n => n[0]).join('').toUpperCase()
              
              return (
                <Card key={appointment.appointmentId} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Icon & Treatment */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          {getAppointmentIcon(appointment.treatmentOptions)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {appointment.treatmentOptions.map(t => 
                              t.charAt(0).toUpperCase() + t.slice(1)
                            ).join(', ') || 'General Appointment'}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{dentistName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{date}</p>
                          <p className="text-gray-600">{time}</p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-200 hover:border-gray-300"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
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
    </div>
  )
}

export default PatientAppointments
