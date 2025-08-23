'use client'

import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default function DentistAppointments() {
    function handleRedirectToSchedule() {
        redirect('/appointment/dentist/schedule')
    }
    return (
        <div>
            <Button onClick={handleRedirectToSchedule}>Adjust Schedule</Button>
            <h1>Dentist Appointments</h1>
        </div>
    )
}