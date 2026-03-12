import { connection } from 'next/server'
import { getSiteSettings, getProducts } from '@/lib/supabase'
import SettingsForm from './SettingsForm'

export const metadata = {
    title: 'Configuracion | FreeCloud Admin',
}

export default async function SettingsPage() {
    await connection()

    // Fetch from database
    const initialSettings = await getSiteSettings()
    const initialProducts = await getProducts()

    return <SettingsForm initialSettings={initialSettings} initialProducts={initialProducts} />
}
