'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { useConfirmationDialog } from '@/components/atoms/confirmation-dialog'
import { CalendarDays, Plus, X, Edit } from 'lucide-react'
import { format, parseISO, startOfDay, endOfDay } from 'date-fns'
import dayjs from 'dayjs'
import { 
  createPhilippineDatetime, 
  formatPhilippineTime, 
  formatPhilippineDate,
  toPhilippineTime
} from '@/utils/timezone'
import { 
  useSpecificDentistAvailabilities, 
  useSpecificDentistAvailabilityMutations,
  useClinicBranches 
} from '@/hooks'
import { 
  CreateSpecificDentistAvailabilityInput, 
  UpdateSpecificDentistAvailabilityInput 
} from '@/server/models/availability.model'

interface SpecificAvailabilityScheduleProps {
  dentistId: string
}

interface SpecificAvailabilityFormData {
  date: Date | undefined
  startTime: string
  endTime: string
  clinicBranchId: number | undefined
}

export function SpecificAvailabilitySchedule({ dentistId }: SpecificAvailabilityScheduleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<any>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [formData, setFormData] = useState<SpecificAvailabilityFormData>({
    date: undefined,
    startTime: '',
    endTime: '',
    clinicBranchId: undefined,
  })

  // Confirmation dialog hook
  const { openDialog, ConfirmationDialog } = useConfirmationDialog()

  // Calculate date range for current month view
  const startDate = startOfDay(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1))
  const endDate = endOfDay(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0))

  // Fetch data
  const { data: specificAvailabilities = [], isLoading } = useSpecificDentistAvailabilities({ 
    dentistId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  })
  const { data: clinicBranches = [] } = useClinicBranches()
  const { create, update, delete: deleteAvailability, isLoading: isMutating } = useSpecificDentistAvailabilityMutations()

  // Reset form
  const resetForm = () => {
    setFormData({
      date: undefined,
      startTime: '',
      endTime: '',
      clinicBranchId: undefined,
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
    // Convert UTC times to Philippine times for editing
    const startInPhilippines = toPhilippineTime(availability.startDateTime)
    const endInPhilippines = toPhilippineTime(availability.endDateTime)
    
    setFormData({
      date: startInPhilippines.toDate(),
      startTime: startInPhilippines.format('HH:mm'),
      endTime: endInPhilippines.format('HH:mm'),
      clinicBranchId: availability.clinicBranchId,
    })
    setIsDialogOpen(true)
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.startTime || !formData.endTime) {
      return
    }

    try {
      // Create datetime strings in UTC (stored in DB as UTC)
      const startDateTime = createPhilippineDatetime(formData.date, formData.startTime)
      const endDateTime = createPhilippineDatetime(formData.date, formData.endTime)

      if (editingAvailability) {
        // Update existing availability
        const updateData: UpdateSpecificDentistAvailabilityInput = {
          id: editingAvailability.id,
          startDateTime,
          endDateTime,
          clinicBranchId: formData.clinicBranchId,
        }
        await update.mutateAsync(updateData)
      } else {
        // Create new availability
        const createData: CreateSpecificDentistAvailabilityInput = {
          dentistId,
          startDateTime,
          endDateTime,
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
    const timeRange = `${formatPhilippineTime(availability.startDateTime)} - ${formatPhilippineTime(availability.endDateTime)}`
    const date = toPhilippineTime(availability.startDateTime).format('dddd, MMMM D, YYYY')
    
    openDialog({
      title: 'Delete Availability',
      description: `Are you sure you want to delete the availability for ${date} from ${timeRange}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => deleteAvailability.mutateAsync(availability.id)
    })
  }

  // Group availabilities by date (using Philippine timezone for grouping)
  const availabilitiesByDate = specificAvailabilities.reduce((acc: any, availability: any) => {
    const philippineTime = toPhilippineTime(availability.startDateTime)
    const date = philippineTime.format('YYYY-MM-DD')
    
    if (!acc[date]) {
      acc[date] = {
        dateKey: date,
        displayDate: philippineTime.format('dddd, MMMM D, YYYY'),
        availabilities: []
      }
    }
    acc[date].availabilities.push(availability)
    return acc
  }, {})

  // Get dates that have availabilities for calendar highlighting (in Philippine timezone)
  const datesWithAvailabilities = Object.keys(availabilitiesByDate).map(dateStr => new Date(dateStr))

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Specific Date and Hours
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Specific Date and Hours
          </CardTitle>
          <p className="text-sm text-muted-foreground">Set custom hours for certain days</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Add Hours
            </Button>
          </DialogTrigger>
        </Dialog>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Calendar view */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={formData.date}
            onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            modifiers={{
              hasAvailability: datesWithAvailabilities
            }}
            modifiersStyles={{
              hasAvailability: { 
                backgroundColor: 'var(--primary-100)', 
                color: 'var(--primary-500)',
                fontWeight: '600'
              }
            }}
            className="rounded-md border"
          />
        </div>

        {/* List of specific availabilities for current month */}
        <div className="space-y-4">
          {Object.keys(availabilitiesByDate).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No specific hours set for {format(selectedMonth, 'MMMM yyyy')}
            </p>
          ) : (
            Object.entries(availabilitiesByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateStr, dateInfo]: [string, any]) => (
                <div key={dateStr} className="space-y-2">
                  <h4 className="font-medium text-sm">
                    {dateInfo.displayDate}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dateInfo.availabilities.map((availability: any) => (
                      <div key={availability.id} className="group relative">
                        <Badge variant="outline" className="pr-12">
                          {formatPhilippineTime(availability.startDateTime)} - {formatPhilippineTime(availability.endDateTime)}
                          {availability.clinicBranch && (
                            <span className="ml-2 text-xs opacity-70">
                              @ {availability.clinicBranch.name}
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
                </div>
              ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAvailability ? 'Edit Specific Availability' : 'Add Specific Hours'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <div className="flex justify-center border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                    disabled={(date) => date < new Date()}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicBranch">Clinic Branch (Optional)</Label>
                                  <Select
                    value={formData.clinicBranchId?.toString() || 'none'}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      clinicBranchId: value === 'none' ? undefined : parseInt(value) 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific clinic</SelectItem>
                      {clinicBranches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isMutating || !formData.date || !formData.startTime || !formData.endTime}
                >
                  {editingAvailability ? 'Update' : 'Add'} Hours
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
