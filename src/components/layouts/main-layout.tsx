import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getServerSession } from "@/actions/get-server-session"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  return (
    <SidebarProvider>
      {session && session.user && (
        <>
          <AppSidebar role={session.user.role || 'patient'} />
          <main className="w-full">
            <SidebarTrigger />
            {children}
          </main>
        </>
      )}
    </SidebarProvider>
  )
}