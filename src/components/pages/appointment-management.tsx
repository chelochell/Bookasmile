'use client'

import { Input } from '../ui/input'
import { IoSearch } from 'react-icons/io5'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ChevronDown, Filter } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { Plus, BellDot, Calendar } from 'lucide-react'
import { DataTable } from '../organisms/appointment-table'
import { createColumnsWithActions } from '../organisms/appointment-table/columns'
import { useAppointments } from '@/hooks/queries/use-appointments'
import { useMemo, useState } from 'react'
import DentalFormDialog from '@/components/atoms/dental-form-dialog'
import { ConfirmationDialog, useConfirmationDialog } from '@/components/atoms/confirmation-dialog'
import { RescheduleAppointmentDialog } from '@/components/atoms/reschedule-appointment-dialog'
import { AssignDentistDialog } from '@/components/atoms/assign-dentist-dialog'
import { AppointmentWithRelations } from '@/server/models/appointment.model'
import { formatPhilippineDateTime, formatPhilippineDate, formatPhilippineTime } from '@/utils/timezone'
import { useConfirmAppointment, useDeleteAppointment, useRescheduleAppointment, useAssignDentist, useCancelAppointment, useResetAppointmentStatus } from '@/hooks/mutations/use-appointment-management-mutations'

const AppointmentManagementPage = () => {
    const [search, setSearch] = useQueryState('search', { defaultValue: '' })
    const [day, setDay] = useQueryState('day', { defaultValue: 'today' })
    const [status, setStatus] = useQueryState('status', { defaultValue: 'all' })

    // React Query mutations
    const confirmAppointmentMutation = useConfirmAppointment()
    const deleteAppointmentMutation = useDeleteAppointment()
    const rescheduleAppointmentMutation = useRescheduleAppointment()
    const assignDentistMutation = useAssignDentist()
    const cancelAppointmentMutation = useCancelAppointment()
    const resetStatusMutation = useResetAppointmentStatus()
    
    // Dialog states
    const deleteDialog = useConfirmationDialog()
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('')
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null)
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
    const [appointmentToReschedule, setAppointmentToReschedule] = useState<AppointmentWithRelations | null>(null)
    const [assignDentistDialogOpen, setAssignDentistDialogOpen] = useState(false)
    const [appointmentToAssignDentist, setAppointmentToAssignDentist] = useState<AppointmentWithRelations | null>(null)

    const dayOptions = [
        { value: 'today', label: 'Today' },
        { value: 'tomorrow', label: 'Tomorrow' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
    ]

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'rescheduled', label: 'Rescheduled' }
    ]

    const selectedDay = dayOptions.find(option => option.value === day)
    const selectedStatus = statusOptions.find(option => option.value === status)

    // Fetch appointments with filters
    const queryParams = useMemo(() => {
        const params: any = {}
        
        if (status !== 'all') {
            params.status = status
        }
        
        if (search) {
            params.search = search
        }
        
        return params
    }, [status, search])

    const { data: appointments = [], isLoading, error } = useAppointments(queryParams)

    // Client-side filtering for search if API doesn't support it
    const filteredAppointments = useMemo(() => {
        if (!search || !appointments || !Array.isArray(appointments)) return appointments || []

        return appointments.filter((appointment: any) => {
            // Ensure appointment object exists and has expected structure
            if (!appointment) return false
            
            const patientName = appointment.patient?.name?.toLowerCase() || ''
            const patientEmail = appointment.patient?.email?.toLowerCase() || ''
            const searchTerm = search.toLowerCase()
            
            const matchesPatient = patientName.includes(searchTerm) || patientEmail.includes(searchTerm)
            
            const matchesTreatment = Array.isArray(appointment.treatmentOptions) && 
                appointment.treatmentOptions.some((treatment: string) => 
                    typeof treatment === 'string' && treatment.toLowerCase().includes(searchTerm)
                )
            
            return matchesPatient || matchesTreatment
        })
    }, [appointments, search])

    // Handler functions
    const handleConfirmAppointment = (appointmentId: string) => {
        confirmAppointmentMutation.mutate({ appointmentId })
    }

    const handleDeleteAppointment = (appointmentId: string) => {
        const appointment = appointments.find((apt: AppointmentWithRelations) => apt.appointmentId === appointmentId)
        if (appointment) {
            setSelectedAppointmentId(appointmentId)
            setSelectedAppointment(appointment)
            deleteDialog.openDialog()
        }
    }

    const confirmDeleteAppointment = async () => {
        if (selectedAppointmentId) {
            deleteAppointmentMutation.mutate({ appointmentId: selectedAppointmentId })
            setSelectedAppointmentId('')
            setSelectedAppointment(null)
        }
    }

    const handleAssignDentist = (appointmentId: string) => {
        const appointment = appointments.find((apt: AppointmentWithRelations) => apt.appointmentId === appointmentId)
        if (appointment) {
            setAppointmentToAssignDentist(appointment)
            setAssignDentistDialogOpen(true)
        }
    }

    const handleRescheduleAppointment = (appointmentId: string) => {
        const appointment = appointments.find((apt: AppointmentWithRelations) => apt.appointmentId === appointmentId)
        if (appointment) {
            setAppointmentToReschedule(appointment)
            setRescheduleDialogOpen(true)
        }
    }

    const handleRescheduleSubmit = (appointmentId: string, newDate: string, newStartTime: string, newEndTime?: string) => {
        rescheduleAppointmentMutation.mutate(
            { appointmentId, newDate, newStartTime, newEndTime },
            {
                onSuccess: () => {
                    setRescheduleDialogOpen(false)
                    setAppointmentToReschedule(null)
                },
                onError: () => {
                    // Error is already handled by the mutation's toast
                }
            }
        )
    }

    const handleAssignDentistSubmit = (appointmentId: string, dentistId: string) => {
        assignDentistMutation.mutate(
            { appointmentId, dentistId },
            {
                onSuccess: () => {
                    setAssignDentistDialogOpen(false)
                    setAppointmentToAssignDentist(null)
                },
                onError: () => {
                    // Error is already handled by the mutation's toast
                }
            }
        )
    }

    const handleCancelAppointment = (appointmentId: string) => {
        cancelAppointmentMutation.mutate({ appointmentId })
    }

    const handleResetStatus = (appointmentId: string) => {
        resetStatusMutation.mutate({ appointmentId })
    }

        // Create columns with action handlers
    const columnsWithActions = useMemo(() => {
        return createColumnsWithActions({
            onConfirmAppointment: handleConfirmAppointment,
            onDeleteAppointment: handleDeleteAppointment,
            onAssignDentist: handleAssignDentist,
            onRescheduleAppointment: handleRescheduleAppointment,
            onCancelAppointment: handleCancelAppointment,
            onResetStatus: handleResetStatus,
            confirmLoading: confirmAppointmentMutation.isPending,
            deleteLoading: deleteAppointmentMutation.isPending,
            cancelLoading: cancelAppointmentMutation.isPending,
            resetLoading: resetStatusMutation.isPending
        })
    }, [confirmAppointmentMutation.isPending, deleteAppointmentMutation.isPending, cancelAppointmentMutation.isPending, resetStatusMutation.isPending])

    return (
        <div className='flex flex-col gap-6'>
            <div>
                <h1 className="text-2xl font-bold">Appointment Management</h1>
                <p className="text-sm text-slate-700">Manage and track all patient appointments</p>
            </div>

            <div className='flex gap-4 w-full border-2 p-4 rounded-md'>
                <div className="relative">
                    <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                        placeholder="Search appointments..." 
                        className="rounded-2xl border-gray-300 pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-2xl border-gray-300">
                                <span>{selectedDay?.label}</span>
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {dayOptions.map((option) => (
                                <DropdownMenuItem 
                                    key={option.value}
                                    onClick={() => setDay(option.value)}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-2xl border-gray-300">
                                <span>{selectedStatus?.label}</span>
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {statusOptions.map((option) => (
                                <DropdownMenuItem 
                                    key={option.value}
                                    onClick={() => setStatus(option.value)}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className="rounded-2xl border-gray-300">
                        <span>Filter</span>
                        <Filter className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className='flex gap-3'>
                <Button className='rounded-2xl'><Plus className="mr-2 h-4 w-4" />New Appointment</Button>
                <Button variant="outline" className='rounded-2xl border-[#3B82F6] text-[#3B82F6]'>
                    <BellDot className="mr-2 h-4 w-4" color='#3B82F6'/>Custom Notification
                </Button>
                <Button variant="outline" className='rounded-2xl border-[#3B82F6] text-[#3B82F6]'>
                    <Calendar className="mr-2 h-4 w-4" color='#3B82F6'/>Set Schedule
                </Button>
            </div>

            <div className="bg-white rounded-lg border">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading appointments...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 mb-2">Failed to load appointments</p>
                            <p className="text-gray-500 text-sm">{error.message}</p>
                        </div>
                    </div>
                ) : (
                    <DataTable columns={columnsWithActions} data={filteredAppointments} />
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => {
                    deleteDialog.closeDialog()
                    setSelectedAppointmentId('')
                    setSelectedAppointment(null)
                }}
                onConfirm={confirmDeleteAppointment}
                title="Delete Appointment"
                description={
                    selectedAppointment
                        ? `Are you sure you want to delete the appointment for ${selectedAppointment.patient?.name || 'this patient'} on ${formatPhilippineDate(selectedAppointment.appointmentDate, 'MMM DD, YYYY')} at ${formatPhilippineTime(selectedAppointment.startTime, 'h:mm A')}? This action cannot be undone.`
                        : 'Are you sure you want to delete this appointment? This action cannot be undone.'
                }
                confirmText="Delete Appointment"
                cancelText="Cancel"
                variant="destructive"
            />

            {/* Reschedule Appointment Dialog */}
            {appointmentToReschedule && (
                <RescheduleAppointmentDialog
                    appointment={appointmentToReschedule}
                    open={rescheduleDialogOpen}
                    onOpenChange={setRescheduleDialogOpen}
                    onReschedule={handleRescheduleSubmit}
                    isLoading={rescheduleAppointmentMutation.isPending}
                />
            )}

            {/* Assign Dentist Dialog */}
            {appointmentToAssignDentist && (
                <AssignDentistDialog
                    appointment={appointmentToAssignDentist}
                    open={assignDentistDialogOpen}
                    onOpenChange={setAssignDentistDialogOpen}
                    onAssignDentist={handleAssignDentistSubmit}
                    isLoading={assignDentistMutation.isPending}
                />
            )}
        </div>
    )
}

export default AppointmentManagementPage
