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

export interface TreatmentType {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

export interface TreatmentTypeProps {
  onSelectionChange: (selectedIds: string[]) => void
  defaultSelected?: string[]
  treatmentTypes?: TreatmentType[]
}

const defaultTreatmentTypes: TreatmentType[] = [
  {
    id: 'checkup',
    name: 'Regular Checkup',
    icon: FaStethoscope,
    description: 'Routine dental examination'
  },
  {
    id: 'cleaning',
    name: 'Teeth Cleaning',
    icon: FaTooth,
    description: 'Professional dental cleaning'
  },
  {
    id: 'filling',
    name: 'Filling',
    icon: FaBandAid,
    description: 'Dental cavity filling'
  },
  {
    id: 'whitening',
    name: 'Teeth Whitening',
    icon: FaRegSmile,
    description: 'Cosmetic teeth whitening'
  },
  {
    id: 'extraction',
    name: 'Tooth Extraction',
    icon: FaCut,
    description: 'Tooth removal procedure'
  },
  {
    id: 'xray',
    name: 'X-Ray',
    icon: FaXRay,
    description: 'Dental radiography'
  },
  {
    id: 'consultation',
    name: 'Consultation',
    icon: FaUserMd,
    description: 'Professional consultation'
  },
  {
    id: 'preventive',
    name: 'Preventive Care',
    icon: FaShieldAlt,
    description: 'Preventive dental treatment'
  }
]

export default function TreatmentType({ 
  onSelectionChange, 
  defaultSelected = [],
  treatmentTypes = defaultTreatmentTypes 
}: TreatmentTypeProps) {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(defaultSelected)

  const handleTreatmentToggle = (treatmentId: string) => {
    const newSelection = selectedTreatments.includes(treatmentId)
      ? selectedTreatments.filter(id => id !== treatmentId)
      : [...selectedTreatments, treatmentId]
    
    setSelectedTreatments(newSelection)
    onSelectionChange(newSelection)
  }

  const isSelected = (treatmentId: string) => selectedTreatments.includes(treatmentId)

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 font-poppins">
          Select Treatment Type
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose one or more treatment types for your appointment
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {treatmentTypes.map((treatment) => {
          const IconComponent = treatment.icon
          const selected = isSelected(treatment.id)
          
          return (
            <div
              key={treatment.id}
              onClick={() => handleTreatmentToggle(treatment.id)}
              className={`
                relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200
                hover:shadow-md group
                ${selected 
                  ? 'border-[#E6A83C] bg-[#FFF8E7]' 
                  : 'border-border bg-card hover:border-[#FFBC4C]/50'
                }
              `}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`
                  p-3 rounded-full transition-colors duration-200
                  ${selected 
                    ? 'bg-[#FFBC4C] text-white' 
                    : 'bg-muted text-muted-foreground group-hover:bg-[#FFBC4C]/10 group-hover:text-[#FFBC4C]'
                  }
                `}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div>
                  <h4 className={`
                    font-medium text-sm transition-colors duration-200
                    ${selected ? 'text-[#B8941F]' : 'text-foreground'}
                  `}>
                    {treatment.name}
                  </h4>
                  {treatment.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-tight">
                      {treatment.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Selection indicator */}
              {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#FFBC4C] rounded-full flex items-center justify-center">
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedTreatments.length > 0 && (
        <div className="mt-6 p-4 bg-[#FFF8E7] border border-[#FFBC4C]/30 rounded-lg">
          <h4 className="font-medium text-sm text-[#B8941F] mb-2">
            Selected Treatments ({selectedTreatments.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTreatments.map((treatmentId) => {
              const treatment = treatmentTypes.find(t => t.id === treatmentId)
              return treatment ? (
                <span 
                  key={treatmentId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FFBC4C] text-white"
                >
                  {treatment.name}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
