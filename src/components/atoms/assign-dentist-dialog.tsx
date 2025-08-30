'use client'

import { useState } from 'react'
import { User, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { AppointmentWithRelations } from '@/server/models/appointment.model'
import { useDentists } from '@/hooks/queries/use-dentists'
import { Skeleton } from '@/components/ui/skeleton'

interface AssignDentistDialogProps {
  appointment: AppointmentWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignDentist: (appointmentId: string, dentistId: string) => void
  isLoading?: boolean
}

export function AssignDentistDialog({
  appointment,
  open,
  onOpenChange,
  onAssignDentist,
  isLoading = false,
}: AssignDentistDialogProps) {
  const [selectedDentistId, setSelectedDentistId] = useState<string>(
    appointment.dentistId || ''
  )

  // Fetch available dentists
  const { data: dentists = [], isLoading: dentistsLoading } = useDentists()

  const handleAssign = () => {
    if (!selectedDentistId || !appointment.appointmentId) {
      return
    }

    onAssignDentist(appointment.appointmentId, selectedDentistId)
  }

  const isFormValid = selectedDentistId && selectedDentistId !== appointment.dentistId && appointment.appointmentId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Assign Dentist
          </DialogTitle>
          <DialogDescription>
            Assign a dentist to the appointment for {appointment.patient?.name || appointment.patientId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Appointment Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Appointment Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Patient:</span>{' '}
                {appointment.patient?.name || appointment.patientId}
              </div>
              <div>
                <span className="font-medium">Date:</span>{' '}
                {new Date(appointment.appointmentDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Time:</span>{' '}
                {new Date(appointment.startTime).toLocaleTimeString()}
              </div>
              <div>
                <span className="font-medium">Branch:</span>{' '}
                {appointment.clinicBranch?.name || 'N/A'}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Treatments:</span>{' '}
                {appointment.treatmentOptions?.join(', ') || 'N/A'}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Current Dentist:</span>{' '}
                {appointment.dentist?.user?.name || 'Not assigned'}
              </div>
            </div>
          </div>

          {/* Dentist Selection */}
          <div className="space-y-3">
            <Label htmlFor="dentist">Select Dentist</Label>
            
            {dentistsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedDentistId}
                onValueChange={setSelectedDentistId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a dentist" />
                </SelectTrigger>
                <SelectContent>
                  {dentists.map((dentist: any) => (
                    <SelectItem key={dentist.id} value={dentist.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{dentist.user?.name || dentist.id}</span>
                        {dentist.specialization && dentist.specialization.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({dentist.specialization.join(', ')})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {dentists.length === 0 && !dentistsLoading && (
              <p className="text-sm text-muted-foreground">
                No dentists available at the moment.
              </p>
            )}
          </div>

          {/* Selected Dentist Info */}
          {selectedDentistId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Selected Dentist</h4>
              {(() => {
                const selectedDentist = dentists.find((d: any) => d.id === selectedDentistId)
                return (
                  <div className="text-sm text-blue-800">
                    <div><span className="font-medium">Name:</span> {selectedDentist?.user?.name || 'Unknown'}</div>
                    {selectedDentist?.specialization && selectedDentist.specialization.length > 0 && (
                      <div><span className="font-medium">Specialization:</span> {selectedDentist.specialization.join(', ')}</div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!isFormValid || isLoading || dentistsLoading}
          >
            {isLoading ? 'Assigning...' : 'Assign Dentist'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
