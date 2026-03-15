import { getSubscribers } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import SubscribersClientView from './SubscribersClientView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Suscriptores | FreeCloud Admin',
}

export default async function SubscribersPage() {
    const supabase = await createClient()
    const subscribers = await getSubscribers(supabase)
    
    return <SubscribersClientView initialSubscribers={subscribers} />
}
