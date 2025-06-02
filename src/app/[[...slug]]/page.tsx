'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import '../../index.css'
import Layout from '@/components/layout'

const App = dynamic(() => import('../../App'), { ssr: false })

export default function Page() {
    const pathname = usePathname()

    // Default to the main App for all routes
    return <App />
}