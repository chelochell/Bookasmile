import { redirect } from "next/navigation"

const AppointmentPage = () => {

    redirect('/appointment/new')
  return (
    <div>AppointmentPage</div>
  )
}

export default AppointmentPage