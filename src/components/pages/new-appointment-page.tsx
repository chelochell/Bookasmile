'use client'

import { useState } from 'react'
import TreatmentType from '@/components/organisms/book/treatment-type'
import AddNote from '@/components/organisms/book/add-note'
import AppointmentSchedule from '@/components/organisms/book/appointment-schedule'

const NewAppointmentPage = () => {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [appointmentNote, setAppointmentNote] = useState<string>('')
  const [selectedDateTime, setSelectedDateTime] = useState<string>('')

  const handleTreatmentSelection = (selectedIds: string[]) => {
    setSelectedTreatments(selectedIds)
    // You can add additional logic here, such as:
    // - Updating form state
    // - Calculating appointment duration
    // - Updating pricing
    console.log('Selected treatments:', selectedIds)
  }

  const handleNoteChange = (note: string) => {
    console.log('Note changed:', note)
    setAppointmentNote(note)
  }

  const handleDateTimeChange = (dateTime: string) => {
    console.log('Date time changed:', dateTime)
    setSelectedDateTime(dateTime)
  }

  return (
    <div className='border-2 rounded-sm py-8 px-12'>
      <p className='font-bold text-lg mb-6'>Book your Appointment</p>
      
      <div className='flex gap-8'>
        {/* Left column - 70% width */}
        <div className='w-[70%] space-y-8'>
          <div>
            <TreatmentType 
              onSelectionChange={handleTreatmentSelection}
              defaultSelected={[]}
            />
          </div>
          
          <div>
            <AddNote 
              onNoteChange={handleNoteChange}
              defaultNote=""
            />
          </div>
        </div>
        
        {/* Right column - 30% width */}
        <div className='w-[30%]'>
          <AppointmentSchedule 
            onDateTimeChange={handleDateTimeChange}
          />
        </div>
      </div>
    </div>
  )
}

export default NewAppointmentPage