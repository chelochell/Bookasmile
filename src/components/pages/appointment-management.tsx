'use client'

import { Input } from '../ui/input'
import { IoSearch } from 'react-icons/io5'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ChevronDown, Filter } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { Plus, BellDot, Calendar } from 'lucide-react'
import { DataTable, columns } from '../organisms/appointment-table'
import { useAppointments } from '@/hooks/queries/use-appointments'
import { useMemo } from 'react'

const AppointmentManagementPage = () => {
    const [search, setSearch] = useQueryState('search', { defaultValue: '' })
    const [day, setDay] = useQueryState('day', { defaultValue: 'today' })
    const [status, setStatus] = useQueryState('status', { defaultValue: 'all' })

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
        { value: 'cancelled', label: 'Cancelled' }
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
        if (!search || !appointments) return appointments

        return appointments.filter((appointment: any) => 
            appointment.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
            appointment.patient?.email?.toLowerCase().includes(search.toLowerCase()) ||
            appointment.treatmentOptions?.some((treatment: string) => 
                treatment.toLowerCase().includes(search.toLowerCase())
            )
        )
    }, [appointments, search])

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
                    <DataTable columns={columns} data={filteredAppointments} />
                )}
            </div>
        </div>
    )
}

export default AppointmentManagementPage
