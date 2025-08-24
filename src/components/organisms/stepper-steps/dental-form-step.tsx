'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Check, Heart, Pill, Info, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DentalSymptom {
  id: string
  category: string
  symptom: string
  severity?: 'mild' | 'moderate' | 'severe'
  description?: string
}

interface DentalConcern {
  id: string
  question: string
  type: 'boolean' | 'multiple' | 'scale'
  options?: string[]
  value?: any
}

interface DentalFormStepProps {
  symptoms: string // JSON string
  onSymptomsChange: (symptoms: string) => void
}

const symptomCategories = [
  {
    category: 'Pain & Discomfort',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'from-red-100 to-red-200',
    symptoms: [
      { id: 'toothache', symptom: 'Toothache' },
      { id: 'jaw_pain', symptom: 'Jaw pain' },
      { id: 'gum_pain', symptom: 'Gum pain' },
      { id: 'sensitivity', symptom: 'Temperature sensitivity' },
      { id: 'throbbing', symptom: 'Throbbing pain' },
      { id: 'sharp_pain', symptom: 'Sharp shooting pain' }
    ]
  },
  {
    category: 'Bleeding & Swelling',
    icon: Heart,
    color: 'text-pink-500',
    bgColor: 'from-pink-100 to-pink-200',
    symptoms: [
      { id: 'bleeding_gums', symptom: 'Bleeding gums' },
      { id: 'swollen_gums', symptom: 'Swollen gums' },
      { id: 'mouth_sores', symptom: 'Mouth sores' },
      { id: 'facial_swelling', symptom: 'Facial swelling' },
      { id: 'lymph_nodes', symptom: 'Swollen lymph nodes' }
    ]
  },
  {
    category: 'Functional Issues',
    icon: Zap,
    color: 'text-orange-500',
    bgColor: 'from-orange-100 to-orange-200',
    symptoms: [
      { id: 'chewing_difficulty', symptom: 'Difficulty chewing' },
      { id: 'jaw_clicking', symptom: 'Jaw clicking/popping' },
      { id: 'grinding', symptom: 'Teeth grinding' },
      { id: 'loose_teeth', symptom: 'Loose teeth' },
      { id: 'bite_problems', symptom: 'Bite problems' }
    ]
  },
  {
    category: 'Cosmetic Concerns',
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'from-blue-100 to-blue-200',
    symptoms: [
      { id: 'discoloration', symptom: 'Tooth discoloration' },
      { id: 'gaps', symptom: 'Gaps between teeth' },
      { id: 'crooked_teeth', symptom: 'Crooked teeth' },
      { id: 'chipped_teeth', symptom: 'Chipped/broken teeth' },
      { id: 'bad_breath', symptom: 'Persistent bad breath' }
    ]
  }
]

const medicalQuestions = [
  {
    id: 'current_medications',
    question: 'Are you currently taking any medications?',
    type: 'boolean' as const
  },
  {
    id: 'allergies',
    question: 'Do you have any known allergies (especially to medications)?',
    type: 'boolean' as const
  },
  {
    id: 'medical_conditions',
    question: 'Do you have any chronic medical conditions?',
    type: 'multiple' as const,
    options: ['Diabetes', 'Heart Disease', 'High Blood Pressure', 'Arthritis', 'None']
  },
  {
    id: 'dental_anxiety',
    question: 'How would you rate your dental anxiety level?',
    type: 'scale' as const,
    options: ['No anxiety', 'Mild anxiety', 'Moderate anxiety', 'High anxiety', 'Severe anxiety']
  }
]

export default function DentalFormStep({ symptoms, onSymptomsChange }: DentalFormStepProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<DentalSymptom[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [painLevel, setPainLevel] = useState<number>(0)

  // Load existing data on mount only
  useEffect(() => {
    if (symptoms) {
      try {
        const parsed = JSON.parse(symptoms)
        setSelectedSymptoms(parsed.symptoms || [])
        setAnswers(parsed.answers || {})
        setPainLevel(parsed.painLevel || 0)
      } catch (error) {
        // Invalid JSON, ignore
      }
    }
  }, []) // Remove symptoms dependency to prevent infinite loop

  // Update parent when data changes (but not on initial load)
  useEffect(() => {
    // Skip update on initial load when all values are empty/default
    if (selectedSymptoms.length === 0 && Object.keys(answers).length === 0 && painLevel === 0) {
      return
    }
    
    const formData = {
      symptoms: selectedSymptoms,
      answers,
      painLevel,
      timestamp: new Date().toISOString()
    }
    onSymptomsChange(JSON.stringify(formData))
  }, [selectedSymptoms, answers, painLevel]) // Remove onSymptomsChange dependency

  const toggleSymptom = (category: string, symptomData: any) => {
    const symptomId = `${category}_${symptomData.id}`
    const existingIndex = selectedSymptoms.findIndex(s => s.id === symptomId)
    
    if (existingIndex >= 0) {
      setSelectedSymptoms(prev => prev.filter(s => s.id !== symptomId))
    } else {
      const newSymptom: DentalSymptom = {
        id: symptomId,
        category,
        symptom: symptomData.symptom
      }
      setSelectedSymptoms(prev => [...prev, newSymptom])
    }
  }

  const isSymptomSelected = (category: string, symptomId: string) => {
    return selectedSymptoms.some(s => s.id === `${category}_${symptomId}`)
  }

  const updateAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const hasData = selectedSymptoms.length > 0 || Object.keys(answers).length > 0 || painLevel > 0

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
          Tell Us About Your Symptoms
        </h2>
        <p className="text-sm text-gray-600">
          Help us understand your dental concerns and medical history
        </p>
      </div>

      {/* Pain Level Scale */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="text-base font-semibold text-red-900 mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Current Pain Level (0-10)
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">No pain</span>
            <span className="text-xs text-gray-600">Severe pain</span>
          </div>
          
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                onClick={() => setPainLevel(level)}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                  painLevel === level
                    ? level <= 3
                      ? "bg-green-500 text-white"
                      : level <= 6
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                )}
              >
                {level}
              </button>
            ))}
          </div>
          
          {painLevel > 0 && (
            <p className={cn(
              "text-xs font-medium",
              painLevel <= 3 ? "text-green-700" : painLevel <= 6 ? "text-yellow-700" : "text-red-700"
            )}>
              Current pain level: {painLevel}/10 {' '}
              {painLevel <= 3 ? "(Mild)" : painLevel <= 6 ? "(Moderate)" : "(Severe)"}
            </p>
          )}
        </div>
      </div>

      {/* Symptoms Selection */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4 font-poppins">
          Select Your Symptoms
        </h3>
        
        <div className="space-y-4">
          {symptomCategories.map((category) => {
            const IconComponent = category.icon
            const categorySymptoms = selectedSymptoms.filter(s => s.category === category.category)
            
            return (
              <div key={category.category} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center mb-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    `bg-gradient-to-r ${category.bgColor}`
                  )}>
                    <IconComponent className={cn("w-4 h-4", category.color)} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{category.category}</h4>
                    {categorySymptoms.length > 0 && (
                      <p className="text-xs text-gray-600">
                        {categorySymptoms.length} symptom{categorySymptoms.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {category.symptoms.map((symptom) => {
                    const isSelected = isSymptomSelected(category.category, symptom.id)
                    
                    return (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(category.category, symptom)}
                        className={cn(
                          "p-2 rounded-lg text-xs font-medium transition-all duration-200 border-2 text-left",
                          isSelected
                            ? `border-${category.color.split('-')[1]}-500 bg-gradient-to-r ${category.bgColor} ${category.color}`
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate pr-1">{symptom.symptom}</span>
                          {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Medical History Questions */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4 font-poppins flex items-center">
          <Pill className="w-4 h-4 mr-2 text-purple-500" />
          Medical History
        </h3>
        
        <div className="space-y-4">
          {medicalQuestions.map((question) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">{question.question}</h4>
              
              {question.type === 'boolean' && (
                <div className="flex space-x-3">
                  {['Yes', 'No'].map((option) => (
                    <button
                      key={option}
                      onClick={() => updateAnswer(question.id, option === 'Yes')}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                        answers[question.id] === (option === 'Yes')
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {question.type === 'multiple' && question.options && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {question.options.map((option) => {
                    const isSelected = Array.isArray(answers[question.id]) 
                      ? answers[question.id].includes(option)
                      : false
                    
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          const current = Array.isArray(answers[question.id]) ? answers[question.id] : []
                          const updated = isSelected
                            ? current.filter((item: string) => item !== option)
                            : [...current, option]
                          updateAnswer(question.id, updated)
                        }}
                        className={cn(
                          "p-2 rounded-lg text-xs font-medium transition-all duration-200 text-left",
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate pr-1">{option}</span>
                          {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
              
              {question.type === 'scale' && question.options && (
                <div className="space-y-1">
                  {question.options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => updateAnswer(question.id, option)}
                      className={cn(
                        "w-full p-2 rounded-lg text-xs font-medium transition-all duration-200 text-left",
                        answers[question.id] === option
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {answers[question.id] === option && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {hasData && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-3 font-poppins flex items-center">
            <Check className="w-4 h-4 mr-2" />
            Summary of Information Provided
          </h4>
          
          <div className="space-y-2 text-blue-800 text-sm">
            {painLevel > 0 && (
              <p><span className="font-medium">Pain Level:</span> {painLevel}/10</p>
            )}
            
            {selectedSymptoms.length > 0 && (
              <div>
                <p className="font-medium">Symptoms Selected:</p>
                <ul className="list-disc list-inside ml-3 space-y-0.5">
                  {selectedSymptoms.map(symptom => (
                    <li key={symptom.id} className="text-xs">
                      {symptom.symptom} ({symptom.category})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {Object.keys(answers).length > 0 && (
              <div>
                <p className="font-medium">Medical History Responses:</p>
                <div className="ml-3 space-y-0.5 text-xs">
                  {Object.entries(answers).map(([key, value]) => {
                    const question = medicalQuestions.find(q => q.id === key)
                    if (!question) return null
                    
                    return (
                      <p key={key}>
                        <span className="font-medium">{question.question.replace('?', '')}:</span>{' '}
                        {Array.isArray(value) ? value.join(', ') : value.toString()}
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
