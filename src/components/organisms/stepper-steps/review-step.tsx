'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { 
  Building2, 
  User, 
  CalendarDays, 
  Clock, 
  Stethoscope, 
  FileText, 
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClinicBranches } from '@/hooks/queries/use-clinic-branches'
import { useCreateAppointment } from '@/hooks/mutations/use-appointment-mutations'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { AppointmentFormData } from '../appointment-stepper'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ReviewStepProps {
  formData: AppointmentFormData
}

const treatmentTypes = [
  { id: 'checkup', name: 'Regular Checkup' },
  { id: 'cleaning', name: 'Teeth Cleaning' },
  { id: 'filling', name: 'Dental Filling' },
  { id: 'whitening', name: 'Teeth Whitening' },
  { id: 'extraction', name: 'Tooth Extraction' },
  { id: 'xray', name: 'Dental X-Ray' },
  { id: 'consultation', name: 'Consultation' },
  { id: 'preventive', name: 'Preventive Care' }
]

export default function ReviewStep({ formData }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = authClient.useSession()
  const router = useRouter()
  
  const { data: branches = [] } = useClinicBranches()
  const createAppointment = useCreateAppointment()

  const selectedBranch = branches.find(b => b.id === formData.clinicBranchId)
  const selectedTreatmentNames = formData.selectedTreatments
    .map(id => treatmentTypes.find(t => t.id === id)?.name)
    .filter(Boolean)

  const formatDateTime = () => {
    if (!formData.selectedDateTime) return 'Not selected'
    const date = new Date(formData.selectedDateTime)
    return `${format(date, 'EEEE, MMMM d, yyyy')} at ${format(date, 'h:mm a')}`
  }

  const parseDentalSymptoms = () => {
    if (!formData.dentalSymptoms) return null
    try {
      return JSON.parse(formData.dentalSymptoms)
    } catch {
      return null
    }
  }

  const dentalData = parseDentalSymptoms()

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      alert('Please log in to submit your appointment')
      return
    }

    setIsSubmitting(true)
    
    try {
      const appointmentData = {
        patientId: session.user.id,
        scheduledBy: session.user.id,
        appointmentDate: formData.selectedDateTime,
        startTime: formData.selectedDateTime,
        treatmentOptions: formData.selectedTreatments,
        clinicBranchId: formData.clinicBranchId || undefined,
        detailedNotes: formData.dentalSymptoms,
        notes: formData.notes,
        status: 'pending' as const
      }

      console.log('Submitting appointment data:', appointmentData)
      
      const result = await createAppointment.mutateAsync(appointmentData)
      console.log('Appointment creation result:', result)
      
      // Success - show success toast and redirect
      toast.success('Appointment booked successfully!')
      router.push('/appointment?success=true')
    } catch (error) {
      console.error('Failed to create appointment:', error)
      
      // Show minimal error messages in toast
      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('validation')) {
          toast.error('Please check your appointment details.')
        } else if (error.message.includes('not found')) {
          toast.error('Selected clinic not available.')
        } else {
          toast.error('Unable to book appointment. Please try again.')
        }
      } else {
        toast.error('Unable to book appointment. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.clinicBranchId &&
      formData.selectedTreatments.length > 0 &&
      formData.selectedDateTime &&
      formData.dentalSymptoms
    )
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
          Review Your Appointment
        </h2>
        <p className="text-sm text-gray-600">
          Please review all details before submitting your appointment request
        </p>
      </div>

      {/* Validation Alert */}
      {!isFormValid() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-red-900 mb-1">Incomplete Information</h4>
            <p className="text-xs text-red-700">
              Please complete all required steps before submitting your appointment.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {/* Basic Information Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Clinic Branch */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center font-poppins">
                <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                Clinic Branch
              </h3>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-6 px-2">
                <Edit className="w-3 h-3 mr-1" />
                <span className="text-xs">Edit</span>
              </Button>
            </div>
            
            {selectedBranch ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{selectedBranch.name}</p>
                <p className="text-xs text-gray-600">{selectedBranch.address}</p>
                <p className="text-xs text-gray-600">{selectedBranch.phone}</p>
              </div>
            ) : (
              <p className="text-red-600 text-sm">No clinic branch selected</p>
            )}
          </div>

          {/* Dentist Assignment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <h3 className="text-sm font-semibold text-blue-900 flex items-center font-poppins">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Dentist Assignment
              </h3>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800">Will be assigned by our staff</p>
              <p className="text-xs text-blue-600">A qualified dentist will be assigned to your appointment based on your treatment needs and availability.</p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center font-poppins">
              <CalendarDays className="w-4 h-4 mr-2 text-purple-500" />
              Date & Time
            </h3>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-6 px-2">
              <Edit className="w-3 h-3 mr-1" />
              <span className="text-xs">Edit</span>
            </Button>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <p className="text-sm font-medium text-gray-900">{formatDateTime()}</p>
          </div>
        </div>

        {/* Procedures */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center font-poppins">
              <Stethoscope className="w-4 h-4 mr-2 text-teal-500" />
              Procedures ({formData.selectedTreatments.length})
            </h3>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-6 px-2">
              <Edit className="w-3 h-3 mr-1" />
              <span className="text-xs">Edit</span>
            </Button>
          </div>
          
          {selectedTreatmentNames.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTreatmentNames.map((name, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-red-600 text-sm">No procedures selected</p>
          )}
        </div>

        {/* Dental Information and Notes Grid */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Dental Symptoms */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center font-poppins">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Dental Information
              </h3>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-6 px-2">
                <Edit className="w-3 h-3 mr-1" />
                <span className="text-xs">Edit</span>
              </Button>
            </div>
            
            {dentalData ? (
              <div className="space-y-3">
                {dentalData.painLevel > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700">Pain Level:</p>
                    <p className="text-sm font-bold text-red-600">{dentalData.painLevel}/10</p>
                  </div>
                )}
                
                {dentalData.symptoms && dentalData.symptoms.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">Symptoms:</p>
                    <div className="flex flex-wrap gap-1">
                      {dentalData.symptoms.slice(0, 4).map((symptom: any, index: number) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          {symptom.symptom}
                        </span>
                      ))}
                      {dentalData.symptoms.length > 4 && (
                        <span className="text-xs text-gray-500">+{dentalData.symptoms.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}
                
                {dentalData.answers && Object.keys(dentalData.answers).length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Medical History:</p>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {Object.entries(dentalData.answers).slice(0, 2).map(([key, value]) => (
                        <p key={key}>
                          <span className="capitalize">{key.replace('_', ' ')}:</span>{' '}
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                      ))}
                      {Object.keys(dentalData.answers).length > 2 && (
                        <p className="text-gray-500">+{Object.keys(dentalData.answers).length - 2} more responses</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-600 text-sm">Dental information not provided</p>
            )}
          </div>

          {/* Additional Notes */}
          {formData.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center font-poppins">
                  <MessageSquare className="w-4 h-4 mr-2 text-yellow-500" />
                  Additional Notes
                </h3>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-6 px-2">
                  <Edit className="w-3 h-3 mr-1" />
                  <span className="text-xs">Edit</span>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">
                  {formData.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
        <h3 className="text-base font-semibold text-green-900 mb-2 font-poppins">
          Ready to Submit Your Appointment?
        </h3>
        <p className="text-green-700 mb-4 text-sm">
          Once submitted, you'll receive a confirmation email and our team will contact you within 24 hours to confirm your appointment.
        </p>
        
        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          className={cn(
            "px-6 py-2 text-sm font-semibold transition-all duration-300",
            isFormValid()
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
          size="default"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Appointment Request'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-3">
          By submitting, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  )
}
