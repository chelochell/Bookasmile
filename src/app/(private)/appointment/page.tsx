import { redirect } from "next/navigation"
import { getServerSession } from "@/actions/get-server-session"

const AppointmentPage = async () => {
    const session = await getServerSession()
    const role = session?.user?.role

    if (role === 'secretary') {
        redirect('/appointment/secretary')
    } else {
        redirect('/appointment/new')
    }
}

export default AppointmentPage