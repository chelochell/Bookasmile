import { getServerSession } from '@/actions/get-server-session'
import { redirect } from 'next/navigation'
import SettingsPage from '@/components/pages/settings/settings-page'

export default async function Settings() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  return <SettingsPage user={session.user as any} />
}
