import SecretaryDashboard from "@/components/pages/secretary/secretary-dashboard";
import PatientDashboard from "@/components/pages/patient/patient-dashboard";
import { getServerSession } from "@/actions/get-server-session";

export default async function DashboardPage() {
    const session = await getServerSession()
    const role = session?.user?.role
    const userId = session?.user?.id

    return (
        <div className="p-4 w-full h-screen">
            <p className="font-bold text-lg text-black">Welcome back, {session?.user?.name}</p>
            <p className="text-sm text-slate-700 ">Here's an overview of your appointments and quick actions.</p>

            {role === 'patient' && (
                <PatientDashboard userId={userId || ''} />
            )}

            {(role === 'admin' || role === 'super_admin') && (
                <div className='flex gap-8'>
                   <p className="text-2xl text-slate-700 ">Admin dashboard</p>
                </div>
            )}

            {role === 'secretary' && (
                <SecretaryDashboard />
            )}
            
        </div>
    );
}