'use client'

import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AppointmentWithRelations } from '@/server/models/appointment.model'
import { cn } from '@/lib/utils'

// Extend dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)

interface RescheduleAppointmentDialogProps {
  appointment: AppointmentWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
  onReschedule: (appointmentId: string, newDate: string, newStartTime: string, newEndTime?: string) => void
  isLoading?: boolean
}

export function RescheduleAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onReschedule,
  isLoading = false,
}: RescheduleAppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(appointment.appointmentDate)
  )
  const [startTime, setStartTime] = useState(
    dayjs(appointment.startTime).tz('Asia/Manila').format('HH:mm')
  )
  const [endTime, setEndTime] = useState(
    appointment.endTime ? dayjs(appointment.endTime).tz('Asia/Manila').format('HH:mm') : ''
  )
  const [calendarOpen, setCalendarOpen] = useState(false)

  const handleReschedule = () => {
    if (!selectedDate || !startTime) {
      return
    }

    // Create date strings in Philippine timezone
    const newDate = dayjs(selectedDate).tz('Asia/Manila').format('YYYY-MM-DD')
    const newStartDateTime = dayjs(`${newDate} ${startTime}`).tz('Asia/Manila').toISOString()
    const newEndDateTime = endTime ? dayjs(`${newDate} ${endTime}`).tz('Asia/Manila').toISOString() : undefined

    onReschedule(appointment.appointmentId, newDate, newStartDateTime, newEndDateTime)
  }

  const isFormValid = selectedDate && startTime

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reschedule Appointment
          </DialogTitle>
          <DialogDescription>
            Reschedule appointment for {appointment.patient?.name || appointment.patientId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Appointment Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Current Schedule</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Date:</span>{' '}
                {dayjs(appointment.appointmentDate).tz('Asia/Manila').format('MMMM D, YYYY')}
              </div>
              <div>
                <span className="font-medium">Time:</span>{' '}
                {dayjs(appointment.startTime).tz('Asia/Manila').format('h:mm A')}
                {appointment.endTime && 
                  ` - ${dayjs(appointment.endTime).tz('Asia/Manila').format('h:mm A')}`
                }
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className="capitalize">{appointment.status}</span>
              </div>
              <div>
                <span className="font-medium">Branch:</span>{' '}
                {appointment.clinicBranch?.name || 'N/A'}
              </div>
            </div>
          </div>

          {/* New Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium">New Schedule</h4>
            
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Select New Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      dayjs(selectedDate).tz('Asia/Manila').format('MMMM D, YYYY')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setCalendarOpen(false)
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time (Optional)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Time validation warning */}
            {startTime && endTime && startTime >= endTime && (
              <p className="text-sm text-destructive">
                End time must be after start time
              </p>
            )}
          </div>

          {/* Summary */}
          {selectedDate && startTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">New Appointment Summary</h4>
              <div className="text-sm text-blue-800">
                <div><span className="font-medium">Patient:</span> {appointment.patient?.name || appointment.patientId}</div>
                <div><span className="font-medium">Date:</span> {dayjs(selectedDate).tz('Asia/Manila').format('MMMM D, YYYY')}</div>
                <div>
                  <span className="font-medium">Time:</span> {dayjs(`2000-01-01 ${startTime}`).format('h:mm A')}
                  {endTime && ` - ${dayjs(`2000-01-01 ${endTime}`).format('h:mm A')}`}
                </div>
                <div><span className="font-medium">Branch:</span> {appointment.clinicBranch?.name || 'N/A'}</div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!isFormValid || isLoading || (startTime && endTime && startTime >= endTime)}
          >
            {isLoading ? 'Rescheduling...' : 'Reschedule Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
