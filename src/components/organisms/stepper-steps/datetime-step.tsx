'use client'

import { useState, useEffect } from 'react'
import { format, isToday, isSameDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useDentists } from '@/hooks/queries/use-dentists'
import { CalendarDays, Clock, User, Stethoscope, CheckCircle2 } from 'lucide-react'

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
  selectedDentistId: string | null
  onDateTimeChange: (dateTime: string) => void
  onDentistChange: (dentistId: string) => void
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
  selectedDentistId,
  onDateTimeChange,
  onDentistChange
}: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedDateTime ? new Date(selectedDateTime) : undefined
  )
  const [selectedTime, setSelectedTime] = useState<string | null>(
    selectedDateTime ? dayjs(selectedDateTime).format('HH:mm') : null
  )

  // Fetch dentists for the selected clinic branch
  const { data: dentists = [], isLoading: dentistsLoading } = useDentists(
    clinicBranchId ? { clinicBranchId } : undefined,
    !!clinicBranchId
  )

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time selection when date changes
    
    if (date && selectedTime && selectedDentistId) {
      updateDateTime(date, selectedTime)
    }
  }

  const handleTimeSelect = (time: string) => {
    if (!selectedDate || !selectedDentistId) return
    
    setSelectedTime(time)
    updateDateTime(selectedDate, time)
  }

  const handleDentistSelect = (dentistId: string) => {
    onDentistChange(dentistId)
    
    if (selectedDate && selectedTime) {
      updateDateTime(selectedDate, selectedTime)
    }
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

  const getSelectedDentist = () => {
    return dentists.find(d => d.id === selectedDentistId)
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
          Choose your preferred dentist, date, and time
        </p>
      </div>

      {/* Dentist Selection */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center font-poppins">
          <Stethoscope className="w-5 h-5 mr-2 text-blue-500" />
          Select Your Dentist
        </h3>
        
        {dentistsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-16 animate-pulse"></div>
            ))}
          </div>
        ) : dentists.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <User className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">No dentists available for this clinic branch</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dentists.map((dentist) => {
              const isSelected = selectedDentistId === dentist.id
              
              return (
                <div
                  key={dentist.id}
                  onClick={() => handleDentistSelect(dentist.id)}
                  className={cn(
                    "relative cursor-pointer rounded-lg p-3 border-2 transition-all duration-300 hover:shadow-md",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      isSelected
                        ? "bg-blue-500"
                        : "bg-gray-100"
                    )}>
                      <User className={cn(
                        "w-5 h-5",
                        isSelected ? "text-white" : "text-gray-500"
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "text-sm font-semibold truncate",
                        isSelected ? "text-blue-900" : "text-gray-900"
                      )}>
                        Dr. {dentist.user.name}
                      </h4>
                      <p className={cn(
                        "text-xs truncate",
                        isSelected ? "text-blue-700" : "text-gray-600"
                      )}>
                        {dentist.specialization.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Date & Time Selection Side by Side */}
      {selectedDentistId && (
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
      )}

      {/* Summary */}
      {selectedDentistId && selectedDate && selectedTime && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            <h4 className="text-sm font-semibold text-green-900 font-poppins">
              Appointment Summary
            </h4>
          </div>
          
          <div className="space-y-1 text-green-800 text-sm">
            <p><span className="font-medium">Dentist:</span> Dr. {getSelectedDentist()?.user.name}</p>
            <p><span className="font-medium">Date & Time:</span> {formatSelectedDateTime()}</p>
            <p><span className="font-medium">Specialization:</span> {getSelectedDentist()?.specialization.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
