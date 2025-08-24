import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getServerSession } from "@/actions/get-server-session"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  return (
    <SidebarProvider>
      {session && session.user && (
        <div className="grid grid-cols-[320px_1fr] h-screen w-full md:grid-cols-[320px_1fr] sm:grid-cols-1">
          <AppSidebar role={session.user.role || 'patient'} user={session.user as any} />
          <main className="bg-gray-100 overflow-auto min-w-0">
            <div className="p-4 h-full">
              <SidebarTrigger className="mb-3 md:hidden" />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit">
                {children}
              </div>
            </div>
          </main>
        </div>
      )}
    </SidebarProvider>
  )
}