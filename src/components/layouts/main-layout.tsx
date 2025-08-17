import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { authClient } from "@/lib/auth-client"
import { auth } from "@/auth"
import { headers } from "next/headers"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  console.log(session)
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