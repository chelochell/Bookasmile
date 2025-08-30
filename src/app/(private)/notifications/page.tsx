import { getServerSession } from '@/actions/get-server-session'
import { redirect } from 'next/navigation'
import NotificationsPage from '@/components/pages/notifications-page'

export default async function NotificationsRoute() {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  return <NotificationsPage userId={session.user.id} />
}
