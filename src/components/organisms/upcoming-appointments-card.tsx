
'use client'

import { useCallback } from "react";
import AppointmentIcon from "../atoms/appointment-icon";
import { StatusBadge, AppointmentStatus } from "@/components/atoms/status-badge"
import { AppointmentDropdown } from "../atoms/appointment-dropdown";

interface Appointment {
  appointmentId: string;
  appointmentDate: string;
  startTime: string;
  treatmentOptions: string[];
  status: string;
  dentist?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    }
  } | null;
  notes?: string | null;
}

interface AppointmentCardProps {
  appointments: Appointment[];
}
  
export default function UpcomingAppointmentsCard({ appointments }: AppointmentCardProps) {
  const handleView = useCallback((appointmentId: string) => {
    // Navigate to appointment details with appointmentId
  }, []);

  const handleReschedule = useCallback((appointmentId: string) => {
    // Handle reschedule with appointmentId
  }, []);

  // Format date and time
  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const time = new Date(timeStr);
    
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = time.toLocaleTimeString('en-US', timeOptions);
    
    return `${formattedDate} • ${formattedTime}`;
  };

  // Get appointment type from treatment options
  const getAppointmentType = (treatments: string[]) => {
    if (!treatments || treatments.length === 0) return 'General Appointment';
    return treatments.map(treatment => 
      treatment.charAt(0).toUpperCase() + treatment.slice(1)
    ).join(', ');
  };

  // Map status to AppointmentStatus enum
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return AppointmentStatus.CONFIRMED;
      case 'pending':
        return AppointmentStatus.PENDING;
      case 'cancelled':
        return AppointmentStatus.CANCELLED;
      default:
        return AppointmentStatus.PENDING;
    }
  };

  const getDropdownOptions = (appointmentId: string) => [
    {
      label: "View",
      key: "view",
      value: "view",
      action: () => handleView(appointmentId)
    },
    {
      label: "Reschedule",
      key: "reschedule",
      value: "reschedule",
      action: () => handleReschedule(appointmentId)
    }
  ];

  if (!appointments || appointments.length === 0) {
    return (
      <div className="w-full rounded-md py-6 px-4 border-2 mt-5">
        <div>
          <p className="font-semibold text-sm text-black mb-2">Upcoming Appointments</p>
        </div>
        <div className="w-full bg-[#f3f9fc] p-4 text-center">
          <p className="text-sm text-slate-700">No upcoming appointments</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full rounded-md py-6 px-4 border-2 mt-5">
        <div>
          <p className="font-semibold text-sm text-black mb-2">Upcoming Appointments</p>
        </div>

        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.appointmentId} className="w-full bg-[#f3f9fc] p-4 flex justify-between items-center">
              <div className="flex gap-4">
                <AppointmentIcon/> 
                <div>
                  <p className="text-sm text-black font-bold">{getAppointmentType(appointment.treatmentOptions)}</p>
                  <p className="text-xs text-slate-700">{appointment.dentist?.user?.name || 'Dentist TBD'}</p>
                  <p className="text-xs text-slate-700">{formatDateTime(appointment.appointmentDate, appointment.startTime)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={getStatusBadge(appointment.status)} />
                <AppointmentDropdown options={getDropdownOptions(appointment.appointmentId)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
