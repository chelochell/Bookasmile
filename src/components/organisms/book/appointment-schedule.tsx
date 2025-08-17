'use client'

import { useState } from 'react'
import { format, isToday, isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

export interface TimeSlot {
  time: string
  available: boolean
}

export interface AppointmentScheduleProps {
  onDateTimeChange: (dateTime: string) => void // UTC string
  availableTimeSlots?: TimeSlot[]
  defaultDate?: Date
  minDate?: Date
  maxDate?: Date
}

const defaultTimeSlots: TimeSlot[] = [
  { time: '9:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '12:00', available: true },
  { time: '1:00', available: true },
  { time: '2:00', available: true },
  { time: '3:00', available: true },
  { time: '4:00', available: true },
]

export default function AppointmentSchedule({
  onDateTimeChange,
  availableTimeSlots = defaultTimeSlots,
  defaultDate,
  minDate,
  maxDate
}: AppointmentScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultDate)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time selection when date changes
  }

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return
    
    setSelectedTime(time)
    
    // Convert time to 24h format and create UTC datetime
    const [timeStr, period] = time.includes('AM') || time.includes('PM') 
      ? [time.replace(/\s?(AM|PM)/, ''), time.includes('PM') ? 'PM' : 'AM']
      : [time, parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM']
    
    let [hours, minutes = '00'] = timeStr.split(':')
    hours = hours.trim()
    
    // Convert to 24h format
    if (period === 'PM' && hours !== '12') {
      hours = (parseInt(hours) + 12).toString()
    } else if (period === 'AM' && hours === '12') {
      hours = '0'
    }
    
    const dateTime = new Date(selectedDate)
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    // Convert to UTC string
    const dateTimeUTC = dateTime.toISOString()
    onDateTimeChange(dateTimeUTC)
  }

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return ''
    return `${format(selectedDate, 'MMMM d, yyyy')} ${selectedTime}`
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Calendar Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 font-poppins">
          Choose date
        </h3>
      </div>

      {/* Shadcn Calendar */}
      <div className="mb-8 flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          className="rounded-md border shadow-sm"
          classNames={{
            day_selected: "bg-[#FFBC4C] text-white hover:bg-[#E6A83C] hover:text-white focus:bg-[#FFBC4C] focus:text-white",
            day_today: "bg-accent text-accent-foreground",
            day: "hover:bg-[#FFBC4C]/10 hover:text-[#FFBC4C]"
          }}
        />
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-poppins">
            Choose available time
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            {availableTimeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time
              
              return (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 border-2",
                    isSelected
                      ? "bg-[#FFBC4C] text-white border-[#FFBC4C]"
                      : slot.available
                        ? "bg-muted text-foreground hover:bg-[#FFBC4C]/10 hover:text-[#FFBC4C] border-transparent hover:border-[#FFBC4C]/20"
                        : "bg-muted/50 text-muted-foreground cursor-not-allowed border-transparent"
                  )}
                >
                  {slot.time}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected DateTime Display */}
      {selectedDate && selectedTime && (
        <div className="flex items-center justify-between p-4 bg-[#FFF8E7] border-2 border-[#FFBC4C] rounded-lg">
          <span className="text-[#B8941F] font-medium">
            {formatSelectedDateTime()}
          </span>
          <Button 
            className="bg-royal-blue-500 hover:bg-royal-blue-600 text-white px-8"
            size="lg"
          >
            Book Now
          </Button>
        </div>
      )}
    </div>
  )
}