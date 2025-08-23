'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Clock } from 'lucide-react'

interface TimePickerProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  disabled?: boolean
}

export function TimePicker({ value, onChange, placeholder = "Select time", disabled = false }: TimePickerProps) {
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Parse the time value when it changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setHours(h || '')
      setMinutes(m || '')
    } else {
      setHours('')
      setMinutes('')
    }
  }, [value])

  // Generate time options
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(timeString)
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  const handleTimeSelect = (time: string) => {
    onChange(time)
    setIsOpen(false)
  }

  const handleManualTimeChange = () => {
    if (hours && minutes) {
      const h = parseInt(hours).toString().padStart(2, '0')
      const m = parseInt(minutes).toString().padStart(2, '0')
      const timeString = `${h}:${m}`
      onChange(timeString)
    }
  }

  const displayValue = value || placeholder

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          {/* Manual time input */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Set time manually</p>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="HH"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="0"
                max="23"
                className="w-16 text-center"
              />
              <span>:</span>
              <Input
                type="number"
                placeholder="MM"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                min="0"
                max="59"
                className="w-16 text-center"
              />
              <Button size="sm" onClick={handleManualTimeChange}>
                Set
              </Button>
            </div>
          </div>

          {/* Quick time selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick select</p>
            <div className="grid grid-cols-4 gap-1 max-h-40 overflow-y-auto">
              {timeOptions.map((time) => (
                <Button
                  key={time}
                  variant={value === time ? "default" : "ghost"}
                  size="sm"
                  className="text-xs"
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
