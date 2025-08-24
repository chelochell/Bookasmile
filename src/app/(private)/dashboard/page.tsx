import QuickActions from "@/components/organisms/quick-actions";
import UpcomingAppointmentsCard from "@/components/organisms/upcoming-appointments-card";
import { getServerSession } from "@/actions/get-server-session";
import { env } from "@/env";
import { AppointmentData } from "@/server/models/appointment.model";

export default async function DashboardPage() {
    const session = await getServerSession()
    const role = session?.user?.role
    const userId = session?.user?.id

    const appointmentsPromise = await fetch(`${env.API_URL}/api/appointments?patientId=${userId}`)
    const response = await appointmentsPromise.json()

    const appointments = response.data.appointments
    const upcomingAppointmentsProps = appointments.map((appointment: AppointmentData) => ({
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        treatmentOptions: appointment.treatmentOptions,
        status: appointment.status,
        dentistName: 'Dentist Name',
        notes: appointment.notes
    }))

    
    return (
        <div className="p-4 w-full h-screen">
            <p className="font-bold text-lg text-black">Welcome back, {session?.user?.name}</p>
            <p className="text-sm text-slate-700 ">Here's an overview of your appointments and quick actions.</p>

            {role === 'patient' && (
                <div className='flex gap-8'>
                    {upcomingAppointmentsProps.length > 0 && (
                        <UpcomingAppointmentsCard appointments={upcomingAppointmentsProps} />
                    )}
                    <QuickActions />
                </div>
            )}

            {(role === 'admin' || role === 'super_admin') && (
                <div className='flex gap-8'>
                   <p className="text-2xl text-slate-700 ">Admin dashboard</p>
                </div>
            )}

            {role === 'secretary' && (
                <div className='flex gap-8'>
                   <p className="text-2xl text-slate-700 ">Secretary dashboard</p>
                </div>
            )}
            
        </div>

        
    );
}