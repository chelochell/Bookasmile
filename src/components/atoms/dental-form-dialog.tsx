'use client'

import { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import DentalFormDisplay from './dental-form-display'

interface DentalFormDialogProps {
  detailedNotes: string
  patientId?: string
  appointmentId?: string
}

export default function DentalFormDialog({ detailedNotes, patientId, appointmentId }: DentalFormDialogProps) {
  const [open, setOpen] = useState(false)

  // Check if there's valid dental form data
  let hasValidData = false
  try {
    if (detailedNotes) {
      const parsed = JSON.parse(detailedNotes)
      hasValidData = (
        (parsed.symptoms && parsed.symptoms.length > 0) ||
        (parsed.answers && Object.keys(parsed.answers).length > 0) ||
        (parsed.painLevel && parsed.painLevel > 0)
      )
    }
  } catch (error) {
    hasValidData = false
  }

  if (!hasValidData) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        disabled
        className="border-border hover:border-border/80 text-muted-foreground"
      >
        <FileText className="w-4 h-4 mr-1" />
        No Medical Info
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-border hover:border-border/80 hover:bg-muted/50"
        >
          <FileText className="w-4 h-4 mr-1" />
          View Medical Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Patient Medical Information
          </DialogTitle>
          {patientId && (
            <p className="text-sm text-muted-foreground">
              Patient: {patientId}
              {appointmentId && ` • Appointment: ${appointmentId}`}
            </p>
          )}
        </DialogHeader>
        <div className="mt-4">
          <DentalFormDisplay detailedNotes={detailedNotes} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
