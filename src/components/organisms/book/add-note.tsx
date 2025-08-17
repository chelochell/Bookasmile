'use client'

import { useState, ChangeEvent } from 'react'

export interface AddNoteProps {
  onNoteChange: (note: string) => void
  defaultNote?: string
  placeholder?: string
  maxLength?: number
}

export default function AddNote({ 
  onNoteChange, 
  defaultNote = '',
  placeholder = 'Add any additional notes or special requests for your appointment...',
  maxLength = 500
}: AddNoteProps) {
  const [note, setNote] = useState<string>(defaultNote)

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value
    if (newNote.length <= maxLength) {
      setNote(newNote)
      onNoteChange(newNote)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 font-poppins">
          Add Note
        </h3>
        <p className="text-sm text-muted-foreground">
          Include any special requests or additional information
        </p>
      </div>

      <div className="relative">
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder={placeholder}
          className="
            w-full min-h-[120px] p-4 rounded-lg border-2 border-border
            bg-card text-foreground placeholder:text-muted-foreground
            focus:border-[#FFBC4C] focus:outline-none focus:ring-0
            transition-colors duration-200 resize-none
            font-mulish text-sm leading-relaxed
          "
          maxLength={maxLength}
        />
        
        {/* Character counter */}
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {note.length}/{maxLength}
        </div>
      </div>

      {/* Note preview when there's content */}
      {note.trim() && (
        <div className="mt-4 p-4 bg-[#FFF8E7] border border-[#FFBC4C]/30 rounded-lg">
          <h4 className="font-medium text-sm text-[#B8941F] mb-2">
            Your Note:
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {note}
          </p>
        </div>
      )}
    </div>
  )
}
