import SignOutButton from "@/components/atoms/SignOutButton";
import QuickActions from "@/components/organisms/quick-actions";
import UpcomingAppointmentsCard from "@/components/organisms/upcoming-appointments-card";

export default function DashboardPage() {

    return (
        <div className="p-4 border-t-2 w-full h-screen">
            
            <p className="font-bold text-lg text-black">Welcome back, Fofie!</p>
            <p className="text-sm text-slate-700 ">Here's an overview kana sa</p>
            
            <div className='flex gap-8'>
  <UpcomingAppointmentsCard/>
  <QuickActions/>
            </div>
          

           
                
           
        </div>
    );
}