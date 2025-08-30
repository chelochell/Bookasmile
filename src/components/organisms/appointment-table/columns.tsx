"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown, Settings, UserPlus, CheckCircle, RotateCcw, Trash2, Eye, X, RefreshCw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DentalFormDialog from '@/components/atoms/dental-form-dialog'

export interface Appointment {
  appointmentId: string
  patientId: string
  dentistId: string | null
  appointmentDate: string
  startTime: string
  endTime: string | null
  notes: string
  detailedNotes?: string
  treatmentOptions: string[]
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled"
  patient: {
    id: string
    name: string
    email: string
  }
  dentist: {
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  } | null
  scheduledByUser: {
    id: string
    name: string
    email: string
  }
}

export interface AppointmentActionsProps {
  onConfirmAppointment: (appointmentId: string) => void
  onDeleteAppointment: (appointmentId: string) => void
  onAssignDentist: (appointmentId: string) => void
  onRescheduleAppointment: (appointmentId: string) => void
  onCancelAppointment: (appointmentId: string) => void
  onResetStatus: (appointmentId: string) => void
  confirmLoading?: boolean
  deleteLoading?: boolean
  cancelLoading?: boolean
  resetLoading?: boolean
}

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original
      const patientName = appointment.patient?.name || "Unknown Patient"
      const initials = patientName
        .split(" ")
        .map((name: string) => name[0] || "")
        .join("")
        .toUpperCase()
        .substring(0, 2) || "UP"

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{patientName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "treatmentOptions",
    header: "Treatment",
    cell: ({ row }) => {
      const treatments = row.getValue("treatmentOptions") as string[]
      if (!Array.isArray(treatments) || treatments.length === 0) {
        return <span className="text-muted-foreground">No treatment specified</span>
      }
      return treatments.filter(Boolean).join(", ") || "No treatment specified"
    },
  },
  {
    accessorKey: "appointmentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const appointment = row.original
      
      let dateDisplay = "Invalid Date"
      let timeDisplay = "Invalid Time"
      
      try {
        if (appointment.appointmentDate) {
          const appointmentDate = new Date(appointment.appointmentDate)
          if (!isNaN(appointmentDate.getTime())) {
            dateDisplay = appointmentDate.toLocaleDateString()
          }
        }
        
        if (appointment.startTime) {
          const startTime = new Date(appointment.startTime)
          if (!isNaN(startTime.getTime())) {
            timeDisplay = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        }
      } catch (error) {
        console.error('Error parsing appointment date/time:', error)
      }
      
      return (
        <div>
          <div className="font-medium">{dateDisplay}</div>
          <div className="text-sm text-muted-foreground">{timeDisplay}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "dentist",
    header: "Dentist",
    cell: ({ row }) => {
      const appointment = row.original
      const dentistName = appointment.dentist?.user?.name
      return dentistName ? (
        <span>Dr. {dentistName}</span>
      ) : (
        <span className="text-muted-foreground">Not assigned</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      const statusConfig = {
        pending: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
        confirmed: { variant: "default" as const, className: "bg-green-100 text-green-800" },
        completed: { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
        cancelled: { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
        rescheduled: { variant: "secondary" as const, className: "bg-purple-100 text-purple-800" },
      }

      const config = statusConfig[status as keyof typeof statusConfig] || {
        variant: "secondary" as const,
        className: "bg-gray-100 text-gray-800"
      }

      return (
        <Badge variant={config.variant} className={config.className}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        </Badge>
      )
    },
  },
  {
    id: "dentalForm",
    header: "Form",
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <DentalFormDialog 
          detailedNotes={appointment.detailedNotes || ''} 
          patientId={appointment.patient?.name || appointment.patientId}
          appointmentId={appointment.appointmentId}
        />
      )
    },
  },
]

// Function to create columns with action handlers
export const createColumnsWithActions = (actionProps: AppointmentActionsProps): ColumnDef<Appointment>[] => {
  return [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const appointment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-border hover:border-border/80"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => actionProps.onAssignDentist(appointment.appointmentId || '')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Dentist
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => actionProps.onConfirmAppointment(appointment.appointmentId || '')}
                disabled={appointment.status === 'confirmed' || actionProps.confirmLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {actionProps.confirmLoading ? 'Confirming...' : 'Confirm Appointment'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => actionProps.onRescheduleAppointment(appointment.appointmentId || '')}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reschedule Appointment
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-blue-600"
                onClick={() => actionProps.onResetStatus(appointment.appointmentId || '')}
                disabled={appointment.status === 'pending' || actionProps.resetLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {actionProps.resetLoading ? 'Resetting...' : 'Reset Status'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-orange-600"
                onClick={() => actionProps.onCancelAppointment(appointment.appointmentId || '')}
                disabled={appointment.status === 'cancelled' || actionProps.cancelLoading}
              >
                <X className="w-4 h-4 mr-2" />
                {actionProps.cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-destructive"
                onClick={() => actionProps.onDeleteAppointment(appointment.appointmentId || '')}
                disabled={actionProps.deleteLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {actionProps.deleteLoading ? 'Deleting...' : 'Delete Appointment'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

// Export original columns for backward compatibility
export { columns }
