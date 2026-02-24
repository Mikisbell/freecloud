'use client'

import { useEffect } from 'react'

interface AdSenseLoaderProps {
    clientId: string
}

export default function AdSenseLoader({ clientId }: AdSenseLoaderProps) {
    useEffect(() => {
        // Prevent duplicate loading
        if (document.querySelector(`script[src*="adsbygoogle"]`)) return

        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)

        return () => {
            // Cleanup on unmount (unlikely for layout but good practice)
            script.remove()
        }
    }, [clientId])

    return null
}
