import QuickActions from "@/components/organisms/quick-actions";
import UpcomingAppointmentsCard from "@/components/organisms/upcoming-appointments-card";
import { getServerSession } from "@/actions/get-server-session";

export default async function DashboardPage() {
    const session = await getServerSession()
    const role = session?.user?.role
    
    return (
        <div className="p-4 border-t-2 w-full h-screen">
            <p className="font-bold text-lg text-black">Welcome back, {session?.user?.name}</p>
            <p className="text-sm text-slate-700 ">Here's an overview of your appointments and quick actions.</p>

            {role === 'patient' && (
                <div className='flex gap-8'>
                    <UpcomingAppointmentsCard />
                    <QuickActions />
                </div>
            )}

            {role === 'admin' || role === 'super_admin' && (
                <div className='flex gap-8'>
                   <p className="text-2xl text-slate-700 ">Admin dashboard</p>
                </div>
            )}
        </div>
    );
}