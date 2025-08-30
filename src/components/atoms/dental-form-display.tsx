'use client'

import { AlertTriangle, Heart, Zap, Info, Pill, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DentalSymptom {
  id: string
  category: string
  symptom: string
  severity?: 'mild' | 'moderate' | 'severe'
  description?: string
}

interface DentalFormData {
  symptoms: DentalSymptom[]
  answers: Record<string, any>
  painLevel: number
  timestamp?: string
}

interface DentalFormDisplayProps {
  detailedNotes: string
  className?: string
}

const categoryConfig = {
  'Pain & Discomfort': {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-800'
  },
  'Bleeding & Swelling': {
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    badgeColor: 'bg-pink-100 text-pink-800'
  },
  'Functional Issues': {
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800'
  },
  'Cosmetic Concerns': {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800'
  }
}

const medicalQuestionLabels = {
  'current_medications': 'Currently taking medications',
  'allergies': 'Known allergies',
  'medical_conditions': 'Medical conditions',
  'dental_anxiety': 'Dental anxiety level'
}

export default function DentalFormDisplay({ detailedNotes, className }: DentalFormDisplayProps) {
  // Parse the JSON data
  let formData: DentalFormData | null = null
  
  try {
    if (detailedNotes) {
      formData = JSON.parse(detailedNotes)
    }
  } catch (error) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        <p>Unable to parse detailed notes</p>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        <p>No detailed notes available</p>
      </div>
    )
  }

  const { symptoms = [], answers = {}, painLevel = 0, timestamp } = formData

  // Group symptoms by category
  const groupedSymptoms = symptoms.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = []
    }
    acc[symptom.category].push(symptom)
    return acc
  }, {} as Record<string, DentalSymptom[]>)

  const getPainLevelInfo = (level: number) => {
    if (level === 0) return { label: 'No pain', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    if (level <= 3) return { label: 'Mild', color: 'text-green-700', bgColor: 'bg-green-100' }
    if (level <= 6) return { label: 'Moderate', color: 'text-yellow-700', bgColor: 'bg-yellow-100' }
    return { label: 'Severe', color: 'text-red-700', bgColor: 'bg-red-100' }
  }

  const formatMedicalAnswer = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None'
    }
    return value?.toString() || 'Not specified'
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Pain Level */}
      {painLevel > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground">Pain Level</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("text-xs font-medium", getPainLevelInfo(painLevel).bgColor, getPainLevelInfo(painLevel).color)}>
                    {painLevel}/10 - {getPainLevelInfo(painLevel).label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptoms by Category */}
      {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig]
        if (!config) return null

        const IconComponent = config.icon

        return (
          <Card key={category} className={cn("border-0 shadow-sm", config.borderColor)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", config.bgColor)}>
                  <IconComponent className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-2">{category}</h4>
                  <div className="space-y-1">
                    {categorySymptoms.map((symptom, index) => (
                      <div key={symptom.id} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{symptom.symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Medical History */}
      {Object.keys(answers).length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Pill className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-3">Medical History</h4>
                <div className="space-y-2">
                  {Object.entries(answers).map(([key, value]) => {
                    const label = medicalQuestionLabels[key as keyof typeof medicalQuestionLabels] || key
                    const formattedValue = formatMedicalAnswer(key, value)
                    
                    return (
                      <div key={key} className="flex justify-between items-start gap-3">
                        <span className="text-sm text-muted-foreground font-medium">{label}:</span>
                        <span className="text-sm text-foreground text-right">{formattedValue}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamp */}
      {timestamp && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Form completed: {new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      )}

      {/* Empty State */}
      {symptoms.length === 0 && Object.keys(answers).length === 0 && painLevel === 0 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Info className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-muted-foreground">No symptoms or medical history recorded</p>
        </div>
      )}
    </div>
  )
}
