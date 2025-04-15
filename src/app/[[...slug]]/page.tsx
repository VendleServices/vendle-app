'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../../index.css'

const App = dynamic(() => import('../../App'), { ssr: false })

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Initial route
    router.push('/start-claim')
  }, [])

  return <App />
}