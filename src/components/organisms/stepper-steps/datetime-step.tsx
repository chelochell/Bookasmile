'use client'

import { useState, useEffect } from 'react'
import { format, isToday, isSameDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react'

// Initialize dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

export interface TimeSlot {
  time: string
  available: boolean
}

interface DateTimeStepProps {
  clinicBranchId: number | null
  selectedDateTime: string
  onDateTimeChange: (dateTime: string) => void
}

const defaultTimeSlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '12:00', available: true },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
]

export default function DateTimeStep({
  clinicBranchId,
  selectedDateTime,
  onDateTimeChange
}: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedDateTime ? new Date(selectedDateTime) : undefined
  )
  const [selectedTime, setSelectedTime] = useState<string | null>(
    selectedDateTime ? dayjs(selectedDateTime).format('HH:mm') : null
  )



  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time selection when date changes
    
    if (date && selectedTime) {
      updateDateTime(date, selectedTime)
    }
  }

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return
    
    setSelectedTime(time)
    updateDateTime(selectedDate, time)
  }



  const updateDateTime = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dateTimeStr = `${dateStr} ${time}`
    
    // Parse as Philippine time then convert to UTC
    const dateTimeUTC = dayjs.tz(dateTimeStr, 'Asia/Manila').utc().toISOString()
    onDateTimeChange(dateTimeUTC)
  }

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return ''
    return `${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime}`
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    return false
  }



  if (!clinicBranchId) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Please select a clinic branch first
        </h3>
        <p className="text-gray-600">
          You need to choose a clinic branch before scheduling your appointment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
          Schedule Your Appointment
        </h2>
        <p className="text-sm text-gray-600">
          Choose your preferred date and time
        </p>
      </div>

      {/* Date & Time Selection Side by Side */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          A dentist will be assigned to your appointment by our staff after booking.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Date Selection */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center font-poppins">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-500" />
            Choose Date
          </h3>
          
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-lg border shadow-sm bg-white scale-90"
              classNames={{
                day_selected: "bg-blue-500 text-white hover:bg-blue-600",
                day_today: "bg-gray-100 text-gray-900 font-semibold",
                day: "hover:bg-blue-50 hover:text-blue-600",
                caption: "text-sm",
                head_cell: "text-xs",
                cell: "text-sm"
              }}
            />
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center font-poppins">
              <Clock className="w-5 h-5 mr-2 text-purple-500" />
              Choose Time
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {defaultTimeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time
                
                return (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border-2",
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500 shadow-md ring-2 ring-blue-100"
                        : slot.available
                          ? "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-200 hover:border-blue-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    )}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {selectedDate && selectedTime && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            <h4 className="text-sm font-semibold text-green-900 font-poppins">
              Appointment Summary
            </h4>
          </div>
          
          <div className="space-y-1 text-green-800 text-sm">
            <p><span className="font-medium">Date & Time:</span> {formatSelectedDateTime()}</p>
            <p><span className="font-medium">Note:</span> A dentist will be assigned by our staff</p>
          </div>
        </div>
      )}
    </div>
  )
}
