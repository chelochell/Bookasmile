import { Badge } from "@/components/ui/badge"

export enum AppointmentStatus {
  CANCELLED = "cancelled",
  PENDING = "pending",
  CONFIRMED = "confirmed",
}

interface StatusBadgeProps {
  status: AppointmentStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusLabels = {
    [AppointmentStatus.CANCELLED]: "Cancelled",
    [AppointmentStatus.PENDING]: "Pending",
    [AppointmentStatus.CONFIRMED]: "Confirmed",
  }

  return (
    <Badge variant={status} className={className}>
      {statusLabels[status]}
    </Badge>
  )
}