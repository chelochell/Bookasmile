import { redirect } from "next/navigation"
import { getServerSession } from "@/actions/get-server-session"
import DentistAppointments from "@/components/pages/dentist/dentist-appointments"

const AppointmentPage = async () => {
    const session = await getServerSession()
    const role = session?.user?.role

    if (role === 'secretary') {
        redirect('/appointment/secretary')
    } else if (role === 'patient') {
        redirect('/appointment/new') //TEMPORARY
    }

    return (
        <>
            {role === 'dentist' && <DentistAppointments />}
        </>
    )
}

export default AppointmentPage