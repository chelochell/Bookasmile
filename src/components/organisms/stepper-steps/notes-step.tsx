'use client'

import { useState, ChangeEvent } from 'react'
import { StickyNote, MessageSquare, Info, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotesStepProps {
  notes: string
  onNotesChange: (notes: string) => void
}

const notePrompts = [
  {
    id: 'special_requests',
    title: 'Special Requests',
    icon: MessageSquare,
    color: 'text-blue-500',
    placeholder: 'Any special accommodations or requests for your appointment...',
    examples: ['Wheelchair accessibility needed', 'Prefer morning appointments', 'Request sedation options']
  },
  {
    id: 'concerns',
    title: 'Additional Concerns',
    icon: Info,
    color: 'text-orange-500',
    placeholder: 'Any other dental concerns or questions...',
    examples: ['Cost concerns', 'Treatment timeline questions', 'Insurance coverage questions']
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: Lightbulb,
    color: 'text-green-500',
    placeholder: 'Your preferences for treatment or communication...',
    examples: ['Prefer detailed explanations', 'Email reminders preferred', 'Music during treatment']
  }
]

export default function NotesStep({ notes, onNotesChange }: NotesStepProps) {
  const [activePrompt, setActivePrompt] = useState<string | null>(null)
  const maxLength = 1000

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value
    if (newNote.length <= maxLength) {
      onNotesChange(newNote)
    }
  }

  const addPromptText = (promptText: string) => {
    const currentNotes = notes || ''
    const newNotes = currentNotes 
      ? `${currentNotes}\n\n${promptText}` 
      : promptText
    
    if (newNotes.length <= maxLength) {
      onNotesChange(newNotes)
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
          Additional Notes
        </h2>
        <p className="text-sm text-gray-600">
          Share any additional information, requests, or concerns with us
        </p>
      </div>

      {/* Quick Prompt Cards */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 font-poppins">
          Need help getting started? Try these prompts:
        </h3>
        
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {notePrompts.map((prompt) => {
            const IconComponent = prompt.icon
            
            return (
              <div
                key={prompt.id}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md",
                  activePrompt === prompt.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
                onClick={() => setActivePrompt(activePrompt === prompt.id ? null : prompt.id)}
              >
                <div className="flex items-center mb-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center mr-2",
                    activePrompt === prompt.id ? "bg-blue-500" : "bg-gray-100"
                  )}>
                    <IconComponent className={cn(
                      "w-4 h-4",
                      activePrompt === prompt.id ? "text-white" : prompt.color
                    )} />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">{prompt.title}</h4>
                </div>
                
                {activePrompt === prompt.id && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 mb-2">{prompt.placeholder}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Examples:</p>
                      {prompt.examples.map((example, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            addPromptText(example)
                          }}
                          className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
                        >
                          • {example}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Notes Textarea */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 font-poppins flex items-center">
            <StickyNote className="w-4 h-4 mr-2 text-yellow-500" />
            Your Notes
          </h3>
          <span className="text-xs text-gray-500">
            {notes.length}/{maxLength} characters
          </span>
        </div>
        
        <div className="relative">
          <textarea
            value={notes}
            onChange={handleNoteChange}
            placeholder="Feel free to share any additional information, special requests, concerns, or questions you have about your upcoming appointment. This helps us provide you with the best possible care..."
            className="
              w-full min-h-[150px] p-4 rounded-lg border-2 border-gray-200
              bg-white text-gray-900 placeholder:text-gray-500
              focus:border-green-500 focus:outline-none focus:ring-0
              transition-colors duration-200 resize-none
              font-mulish text-sm leading-relaxed
            "
            maxLength={maxLength}
          />
          
          {/* Character indicator */}
          <div className={cn(
            "absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full",
            notes.length > maxLength * 0.9
              ? "bg-red-100 text-red-600"
              : notes.length > maxLength * 0.7
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-500"
          )}>
            {notes.length}/{maxLength}
          </div>
        </div>
      </div>

      {/* Helpful Tips and Notes Preview Side by Side */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Helpful Tips */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Helpful Tips</h4>
              <ul className="text-xs text-yellow-800 space-y-0.5">
                <li>• Mention any medications you're currently taking</li>
                <li>• Let us know about any dental anxiety or fears</li>
                <li>• Share your preferred communication methods</li>
                <li>• Include any accessibility needs</li>
                <li>• Ask about payment options or insurance coverage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notes Preview */}
        {notes.trim() && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-900 mb-2 font-poppins flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Your Notes Preview
            </h4>
            <div className="bg-white p-3 rounded-lg border border-green-200 max-h-32 overflow-y-auto">
              <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">
                {notes}
              </p>
            </div>
            <p className="text-xs text-green-700 mt-2">
              This information will be shared with your dental care team to help them prepare for your visit.
            </p>
          </div>
        )}
      </div>

      {/* Optional Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          This step is optional. You can proceed without adding notes if you prefer.
        </p>
      </div>
    </div>
  )
}
