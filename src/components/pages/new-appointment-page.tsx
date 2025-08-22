'use client'

import { useState } from 'react'
import TreatmentType from '@/components/organisms/book/treatment-type'
import AddNote from '@/components/organisms/book/add-note'
import AppointmentSchedule from '@/components/organisms/book/appointment-schedule'
import { Button } from '@/components/ui/button'
import { utcToPhilippineTime } from '@/utils/time-converter'
import { authClient } from '@/lib/auth-client'
import { useCreateAppointment } from '@/hooks/mutations/useAppointmentMutations'
import { AppointmentStatusEnum } from '@/server/models/appointment.model'
import { useRouter } from 'next/navigation'

const NewAppointmentPage = () => {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [appointmentNote, setAppointmentNote] = useState<string>('')
  const [selectedDateTime, setSelectedDateTime] = useState<string>('')
  const { data: session } = authClient.useSession()
  const createAppointment = useCreateAppointment()
  const router = useRouter()

  const handleTreatmentSelection = (selectedIds: string[]) => {
    setSelectedTreatments(selectedIds)
    // You can add additional logic here, such as:
    // - Updating form state
    // - Calculating appointment duration
    // - Updating pricing
  }

  const handleNoteChange = (note: string) => {
    setAppointmentNote(note)
  }

  const handleDateTimeChange = (dateTime: string) => {
    setSelectedDateTime(dateTime)
  }

  function handleSubmit() {
    createAppointment.mutate({
      patientId: session?.user?.id || '',
      treatmentOptions: selectedTreatments,
      appointmentDate: selectedDateTime,
      notes: appointmentNote,
      scheduledBy: session?.user?.id || '',
      startTime: selectedDateTime,
      status: AppointmentStatusEnum.PENDING,
    })
    router.push('/dashboard')
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
      
      {/* Book Now Button */}
      {selectedTreatments.length > 0 && selectedDateTime && (
        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-royal-blue-500 hover:bg-royal-blue-600 text-white px-12 py-3"
            size="lg"
            onClick={handleSubmit}
          >
            Book Now
          </Button>
        </div>
      )}
    </div>
  )
}

export default NewAppointmentPage