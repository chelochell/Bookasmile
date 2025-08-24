'use client'

import AppointmentStepper from '@/components/organisms/appointment-stepper'

const NewAppointmentPage = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <AppointmentStepper />
      </div>
    </div>
  )
}

export default NewAppointmentPage