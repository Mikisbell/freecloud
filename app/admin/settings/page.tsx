import { connection } from 'next/server'
import { getSiteSettings, getProducts } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from './SettingsForm'

export const metadata = {
    title: 'Configuracion | FreeCloud Admin',
}

export default async function SettingsPage() {
    await connection()
    const supabase = await createClient()

    // Fetch from database
    const initialSettings = await getSiteSettings(supabase)
    const initialProducts = await getProducts(null, supabase)

    return <SettingsForm initialSettings={initialSettings} initialProducts={initialProducts} />
}
