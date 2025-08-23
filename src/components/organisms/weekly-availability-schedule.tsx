'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TimePicker } from '@/components/atoms/time-picker'
import { Badge } from '@/components/ui/badge'
import { useConfirmationDialog } from '@/components/atoms/confirmation-dialog'
import { Clock, Plus, X, Edit } from 'lucide-react'
import { 
  useDentistAvailabilities, 
  useDentistAvailabilityMutations,
  useClinicBranches 
} from '@/hooks'
import { 
  CreateDentistAvailabilityInput, 
  UpdateDentistAvailabilityInput,
  DayOfWeekEnum 
} from '@/server/models/availability.model'

interface WeeklyAvailabilityScheduleProps {
  dentistId: string
}

interface AvailabilityFormData {
  dayOfWeek: string
  standardStartTime: string
  standardEndTime: string
  breakStartTime?: string
  breakEndTime?: string
  clinicBranchId: number
}

const daysOfWeek = [
  { value: DayOfWeekEnum.MONDAY, label: 'Monday', short: 'M' },
  { value: DayOfWeekEnum.TUESDAY, label: 'Tuesday', short: 'T' },
  { value: DayOfWeekEnum.WEDNESDAY, label: 'Wednesday', short: 'W' },
  { value: DayOfWeekEnum.THURSDAY, label: 'Thursday', short: 'T' },
  { value: DayOfWeekEnum.FRIDAY, label: 'Friday', short: 'F' },
  { value: DayOfWeekEnum.SATURDAY, label: 'Saturday', short: 'S' },
  { value: DayOfWeekEnum.SUNDAY, label: 'Sunday', short: 'S' },
]

export function WeeklyAvailabilitySchedule({ dentistId }: WeeklyAvailabilityScheduleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<any>(null)
  const [formData, setFormData] = useState<AvailabilityFormData>({
    dayOfWeek: '',
    standardStartTime: '',
    standardEndTime: '',
    breakStartTime: '',
    breakEndTime: '',
    clinicBranchId: 0,
  })

  // Confirmation dialog hook
  const { openDialog, ConfirmationDialog } = useConfirmationDialog()

  // Fetch data
  const { data: availabilities = [], isLoading } = useDentistAvailabilities({ dentistId })
  const { data: clinicBranches = [] } = useClinicBranches()
  const { create, update, delete: deleteAvailability, isLoading: isMutating } = useDentistAvailabilityMutations()

  // Reset form
  const resetForm = () => {
    setFormData({
      dayOfWeek: '',
      standardStartTime: '',
      standardEndTime: '',
      breakStartTime: '',
      breakEndTime: '',
      clinicBranchId: 0,
    })
    setEditingAvailability(null)
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  // Handle edit
  const handleEdit = (availability: any) => {
    setEditingAvailability(availability)
    setFormData({
      dayOfWeek: availability.dayOfWeek,
      standardStartTime: availability.standardStartTime,
      standardEndTime: availability.standardEndTime,
      breakStartTime: availability.breakStartTime || '',
      breakEndTime: availability.breakEndTime || '',
      clinicBranchId: availability.clinicBranchId,
    })
    setIsDialogOpen(true)
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.dayOfWeek || !formData.standardStartTime || !formData.standardEndTime || !formData.clinicBranchId) {
      return
    }

    try {
      if (editingAvailability) {
        // Update existing availability
        const updateData: UpdateDentistAvailabilityInput = {
          id: editingAvailability.id,
          dayOfWeek: formData.dayOfWeek as any,
          standardStartTime: formData.standardStartTime,
          standardEndTime: formData.standardEndTime,
          breakStartTime: formData.breakStartTime || undefined,
          breakEndTime: formData.breakEndTime || undefined,
          clinicBranchId: formData.clinicBranchId,
        }
        await update.mutateAsync(updateData)
      } else {
        // Create new availability
        const createData: CreateDentistAvailabilityInput = {
          dentistId,
          dayOfWeek: formData.dayOfWeek as any,
          standardStartTime: formData.standardStartTime,
          standardEndTime: formData.standardEndTime,
          breakStartTime: formData.breakStartTime || undefined,
          breakEndTime: formData.breakEndTime || undefined,
          clinicBranchId: formData.clinicBranchId,
        }
        await create.mutateAsync(createData)
      }
      
      handleDialogClose()
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  // Handle delete
  const handleDelete = (availability: any) => {
    const timeRange = `${availability.standardStartTime} - ${availability.standardEndTime}`
    const dayName = daysOfWeek.find(d => d.value === availability.dayOfWeek)?.label || availability.dayOfWeek
    const breakInfo = availability.breakStartTime && availability.breakEndTime 
      ? ` (Break: ${availability.breakStartTime}-${availability.breakEndTime})` 
      : ''
    
    openDialog({
      title: 'Delete Weekly Availability',
      description: `Are you sure you want to delete the ${dayName} availability from ${timeRange}${breakInfo}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => deleteAvailability.mutateAsync(availability.id)
    })
  }

  // Group availabilities by day
  const availabilitiesByDay = daysOfWeek.map(day => ({
    ...day,
    availabilities: availabilities.filter((a: any) => a.dayOfWeek === day.value)
  }))

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Weekly Hours
        </CardTitle>
        <p className="text-sm text-muted-foreground">Set when you are typically available</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {availabilitiesByDay.map((day) => (
          <div key={day.value} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                {day.short}
              </div>
              <div className="min-w-24">
                <p className="font-medium">{day.label}</p>
              </div>
            </div>
            
            <div className="flex-1 mx-4">
              {day.availabilities.length === 0 ? (
                <span className="text-muted-foreground text-sm">Unavailable</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {day.availabilities.map((availability: any) => (
                    <div key={availability.id} className="group relative">
                      <Badge variant="secondary" className="pr-8">
                        {availability.standardStartTime} - {availability.standardEndTime}
                        {availability.breakStartTime && availability.breakEndTime && (
                          <span className="ml-1 text-xs opacity-70">
                            (Break: {availability.breakStartTime}-{availability.breakEndTime})
                          </span>
                        )}
                      </Badge>
                      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDelete(availability)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="absolute -top-1 -right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEdit(availability)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="ml-2"
                  onClick={resetForm}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ))}

        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAvailability ? 'Edit Availability' : 'Add Availability'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select
                    value={formData.dayOfWeek}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicBranch">Clinic Branch</Label>
                  <Select
                    value={formData.clinicBranchId.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, clinicBranchId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinicBranches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <TimePicker
                    value={formData.standardStartTime}
                    onChange={(time) => setFormData(prev => ({ ...prev, standardStartTime: time }))}
                    placeholder="Select start time"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <TimePicker
                    value={formData.standardEndTime}
                    onChange={(time) => setFormData(prev => ({ ...prev, standardEndTime: time }))}
                    placeholder="Select end time"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Break Time (Optional)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="breakStart" className="text-xs text-muted-foreground">Break Start</Label>
                    <TimePicker
                      value={formData.breakStartTime}
                      onChange={(time) => setFormData(prev => ({ ...prev, breakStartTime: time }))}
                      placeholder="Break start time"
                    />
                  </div>
                  <div>
                    <Label htmlFor="breakEnd" className="text-xs text-muted-foreground">Break End</Label>
                    <TimePicker
                      value={formData.breakEndTime}
                      onChange={(time) => setFormData(prev => ({ ...prev, breakEndTime: time }))}
                      placeholder="Break end time"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isMutating || !formData.dayOfWeek || !formData.standardStartTime || !formData.standardEndTime || !formData.clinicBranchId}
                >
                  {editingAvailability ? 'Update' : 'Add'} Availability
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <ConfirmationDialog />
      </CardContent>
    </Card>
  )
}
