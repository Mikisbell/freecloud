import { getSubscribers } from '@/lib/supabase'
import SubscribersClientView from './SubscribersClientView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Suscriptores | FreeCloud Admin',
}

export default async function SubscribersPage() {
    const subscribers = await getSubscribers()
    
    return <SubscribersClientView initialSubscribers={subscribers} />
}
