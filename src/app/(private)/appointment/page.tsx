import { redirect } from "next/navigation"
import { getServerSession } from "@/actions/get-server-session"
import DentistAppointments from "@/components/pages/dentist/dentist-appointments"
import PatientAppointments from "@/components/pages/patient/patient-appointments"

const AppointmentPage = async () => {
    const session = await getServerSession()
    const role = session?.user?.role

    if (role === 'secretary') {
        redirect('/appointment/secretary')
    }

    return (
        <>
            {role === 'dentist' && <DentistAppointments />}
            {role === 'patient' && <PatientAppointments />}
        </>
    )
}

export default AppointmentPage