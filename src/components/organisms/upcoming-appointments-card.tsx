
'use client'

import React, { useCallback } from "react";
import AppointmentIcon from "../atoms/appointment-icon";
import { StatusBadge, AppointmentStatus } from "@/components/atoms/status-badge"
import { AppointmentDropdown } from "../atoms/appointment-dropdown";

  
export default function UpcomingAppointmentsCard() {
  const handleView = useCallback(() => {
    console.log("View appointment clicked");
  }, []);

  const handleReschedule = useCallback(() => {
    console.log("Reschedule appointment clicked");
  }, []);

  const dropdownOptions = [
    {
      label: "View",
      key: "view",
      value: "view",
      action: handleView
    },
    {
      label: "Reschedule",
      key: "reschedule",
      value: "reschedule",
      action: handleReschedule
    }
  ];
    
  return (
    <>
      <div className="w-full rounded-md py-6 px-4 border-2 mt-5">
        <div>
          <p className="font-semibold text-sm text-black mb-2">Upcoming Appointments</p>
        </div>

        <div className="w-full bg-[#f3f9fc] p-4 flex justify-between items-center">
            <div className="flex gap-4 ">
                <AppointmentIcon/> 
                <div >
                    <p className="text-sm text-black font-bold">Regular Checkup</p>
                    <p className="text-xs text-slate-700">Dr. Rodriguez</p>
                    <p className="text-xs text-slate-700">July 15, 2025 &bull; 10:00 AM</p>

                </div>
            </div>
            <div className="flex gap-2 ">
                <StatusBadge status={AppointmentStatus.CONFIRMED} />
                <AppointmentDropdown options={dropdownOptions} />
            </div>
        </div>

        
      </div>
    </>
  );
}
