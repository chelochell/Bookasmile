'use client'

import { useState } from 'react'
import { 
  FaTooth, 
  FaUserMd, 
  FaBandAid, 
  FaRegSmile, 
  FaShieldAlt,
  FaCut,
  FaXRay,
  FaStethoscope 
} from 'react-icons/fa'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TreatmentType {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  estimatedDuration: string
  color: string
  bgColor: string
}

interface ProcedureStepProps {
  selectedTreatments: string[]
  onTreatmentChange: (selectedIds: string[]) => void
}

const treatmentTypes: TreatmentType[] = [
  {
    id: 'checkup',
    name: 'Regular Checkup',
    icon: FaStethoscope,
    description: 'Routine dental examination and consultation',
    estimatedDuration: '30-45 min',
    color: 'text-blue-600',
    bgColor: 'from-blue-100 to-blue-200'
  },
  {
    id: 'cleaning',
    name: 'Teeth Cleaning',
    icon: FaTooth,
    description: 'Professional dental cleaning and polishing',
    estimatedDuration: '45-60 min',
    color: 'text-emerald-600',
    bgColor: 'from-emerald-100 to-emerald-200'
  },
  {
    id: 'filling',
    name: 'Dental Filling',
    icon: FaBandAid,
    description: 'Cavity filling and restoration',
    estimatedDuration: '60-90 min',
    color: 'text-orange-600',
    bgColor: 'from-orange-100 to-orange-200'
  },
  {
    id: 'whitening',
    name: 'Teeth Whitening',
    icon: FaRegSmile,
    description: 'Professional teeth whitening treatment',
    estimatedDuration: '90-120 min',
    color: 'text-purple-600',
    bgColor: 'from-purple-100 to-purple-200'
  },
  {
    id: 'extraction',
    name: 'Tooth Extraction',
    icon: FaCut,
    description: 'Safe tooth removal procedure',
    estimatedDuration: '30-60 min',
    color: 'text-red-600',
    bgColor: 'from-red-100 to-red-200'
  },
  {
    id: 'xray',
    name: 'Dental X-Ray',
    icon: FaXRay,
    description: 'Digital dental radiography',
    estimatedDuration: '15-30 min',
    color: 'text-indigo-600',
    bgColor: 'from-indigo-100 to-indigo-200'
  },
  {
    id: 'consultation',
    name: 'Consultation',
    icon: FaUserMd,
    description: 'Professional dental consultation',
    estimatedDuration: '30 min',
    color: 'text-teal-600',
    bgColor: 'from-teal-100 to-teal-200'
  },
  {
    id: 'preventive',
    name: 'Preventive Care',
    icon: FaShieldAlt,
    description: 'Preventive dental treatment and care',
    estimatedDuration: '45 min',
    color: 'text-green-600',
    bgColor: 'from-green-100 to-green-200'
  }
]

export default function ProcedureStep({ selectedTreatments, onTreatmentChange }: ProcedureStepProps) {
  const handleTreatmentToggle = (treatmentId: string) => {
    const newSelection = selectedTreatments.includes(treatmentId)
      ? selectedTreatments.filter(id => id !== treatmentId)
      : [...selectedTreatments, treatmentId]
    
    onTreatmentChange(newSelection)
  }

  const isSelected = (treatmentId: string) => selectedTreatments.includes(treatmentId)

  const getTotalEstimatedTime = () => {
    if (selectedTreatments.length === 0) return null
    
    const selectedTypes = treatmentTypes.filter(t => selectedTreatments.includes(t.id))
    const totalMinutes = selectedTypes.reduce((total, treatment) => {
      const duration = treatment.estimatedDuration
      const avgMinutes = duration.includes('-') 
        ? (parseInt(duration.split('-')[0]) + parseInt(duration.split('-')[1])) / 2
        : parseInt(duration)
      return total + avgMinutes
    }, 0)
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
          Select Your Procedures
        </h2>
        <p className="text-sm text-gray-600">
          Choose one or more dental procedures for your appointment
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {treatmentTypes.map((treatment) => {
          const IconComponent = treatment.icon
          const selected = isSelected(treatment.id)
          
          return (
            <div
              key={treatment.id}
              onClick={() => handleTreatmentToggle(treatment.id)}
              className={cn(
                "relative cursor-pointer rounded-lg p-3 border-2 transition-all duration-300 hover:shadow-md",
                selected
                  ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50"
              )}
            >
              {/* Selection indicator */}
              {selected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className={`w-4 h-4 ${treatment.color}`} />
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto transition-all duration-300",
                selected
                  ? "bg-blue-100 border-2 border-blue-300"
                  : "bg-gray-100 hover:bg-gray-200"
              )}>
                <IconComponent className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  selected ? treatment.color : "text-gray-600"
                )} />
              </div>

              {/* Content */}
              <div className="text-center space-y-1">
                <h3 className={cn(
                  "text-sm font-semibold font-poppins transition-colors duration-300",
                  selected ? "text-blue-700" : "text-gray-900"
                )}>
                  {treatment.name}
                </h3>
                
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {treatment.description}
                </p>
                
                <div className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  selected 
                    ? "text-blue-600 bg-white/70"
                    : "text-gray-500 bg-gray-100"
                )}>
                  {treatment.estimatedDuration}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedTreatments.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-900 font-poppins">
              Selected Procedures ({selectedTreatments.length})
            </h4>
            <div className="text-right">
              <p className="text-xs text-blue-700">Estimated Total</p>
              <p className="text-sm font-bold text-blue-900">{getTotalEstimatedTime()}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {selectedTreatments.map((treatmentId) => {
              const treatment = treatmentTypes.find(t => t.id === treatmentId)
              if (!treatment) return null
              
              return (
                <span 
                  key={treatmentId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-blue-600"
                >
                  {treatment.name}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
