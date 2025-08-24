'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import ClinicBranchStep from './stepper-steps/clinic-branch-step'
import ProcedureStep from './stepper-steps/procedure-step'
import DateTimeStep from './stepper-steps/datetime-step'
import DentalFormStep from './stepper-steps/dental-form-step'
import NotesStep from './stepper-steps/notes-step'
import ReviewStep from './stepper-steps/review-step'

export interface AppointmentFormData {
  clinicBranchId: number | null
  selectedTreatments: string[]
  dentistId: string | null
  selectedDateTime: string
  dentalSymptoms: string // JSON string of dental issues/symptoms
  notes: string
}

const steps = [
  { id: 1, title: 'Clinic Branch', description: 'Choose your preferred location' },
  { id: 2, title: 'Procedure', description: 'Select treatment type' },
  { id: 3, title: 'Date & Time', description: 'Schedule appointment' },
  { id: 4, title: 'Dental Form', description: 'Symptoms & concerns' },
  { id: 5, title: 'Notes', description: 'Additional information' },
  { id: 6, title: 'Review', description: 'Confirm & submit' }
]

export default function AppointmentStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<AppointmentFormData>({
    clinicBranchId: null,
    selectedTreatments: [],
    dentistId: null,
    selectedDateTime: '',
    dentalSymptoms: '',
    notes: ''
  })

  const updateFormData = (field: keyof AppointmentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.clinicBranchId !== null
      case 2:
        return formData.selectedTreatments.length > 0
      case 3:
        return formData.selectedDateTime && formData.dentistId
      case 4:
        return formData.dentalSymptoms !== ''
      case 5:
        return true // Notes are optional
      case 6:
        return true // Review step
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClinicBranchStep
            selectedBranchId={formData.clinicBranchId}
            onBranchSelect={(branchId) => updateFormData('clinicBranchId', branchId)}
          />
        )
      case 2:
        return (
          <ProcedureStep
            selectedTreatments={formData.selectedTreatments}
            onTreatmentChange={(treatments: string[]) => updateFormData('selectedTreatments', treatments)}
          />
        )
      case 3:
        return (
          <DateTimeStep
            clinicBranchId={formData.clinicBranchId}
            selectedDateTime={formData.selectedDateTime}
            selectedDentistId={formData.dentistId}
            onDateTimeChange={(dateTime: string) => updateFormData('selectedDateTime', dateTime)}
            onDentistChange={(dentistId: string) => updateFormData('dentistId', dentistId)}
          />
        )
      case 4:
        return (
          <DentalFormStep
            symptoms={formData.dentalSymptoms}
            onSymptomsChange={(symptoms: string) => updateFormData('dentalSymptoms', symptoms)}
          />
        )
      case 5:
        return (
          <NotesStep
            notes={formData.notes}
            onNotesChange={(notes: string) => updateFormData('notes', notes)}
          />
        )
      case 6:
        return (
          <ReviewStep
            formData={formData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900 font-poppins mb-1">
          Book Your Appointment, <span className="text-primary">Book A Smile</span>
        </h1>
        <p className="text-sm text-gray-600">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 border-2",
                    currentStep > step.id
                      ? "bg-green-500 text-white border-green-500"
                      : currentStep === step.id
                      ? "bg-primary text-white border-primary ring-2 ring-blue-100"
                      : "bg-white text-gray-400 border-gray-300"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-1 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-3 transition-all duration-300",
                    currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6 min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-1 text-sm h-9"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-xs text-gray-500">
          Step {currentStep} of {steps.length}
        </div>

        {currentStep < steps.length && (
          <Button
            onClick={nextStep}
            disabled={!canProceedToNext()}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-sm h-9"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
