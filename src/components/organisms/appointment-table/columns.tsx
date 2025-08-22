"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Appointment {
  appointmentId: string
  patientId: string
  dentistId: string | null
  appointmentDate: string
  startTime: string
  endTime: string | null
  notes: string
  treatmentOptions: string[]
  status: "pending" | "confirmed" | "completed" | "cancelled"
  patient: {
    id: string
    name: string
    email: string
  }
  dentist: {
    id: string
    name: string
    email: string
  } | null
  scheduledByUser: {
    id: string
    name: string
    email: string
  }
}

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original
      const patientName = appointment.patient?.name || "Unknown"
      const initials = patientName
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()

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
      return treatments?.join(", ") || "No treatment specified"
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
      const appointmentDate = new Date(appointment.appointmentDate)
      const startTime = new Date(appointment.startTime)
      
      return (
        <div>
          <div className="font-medium">{appointmentDate.toLocaleDateString()}</div>
          <div className="text-sm text-muted-foreground">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "dentist",
    header: "Dentist",
    cell: ({ row }) => {
      const appointment = row.original
      const dentistName = appointment.dentist?.name
      return dentistName || <span className="text-muted-foreground">None</span>
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
      }

      const config = statusConfig[status as keyof typeof statusConfig]

      return (
        <Badge variant={config.variant} className={config.className}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(appointment.appointmentId)}
            >
              Copy appointment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit appointment</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Cancel appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
