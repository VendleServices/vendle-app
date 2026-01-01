'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-vendle-navy">Oops!</h1>
          <h2 className="text-xl text-vendle-blue">Something went wrong</h2>
          <p className="text-sm text-gray-600 max-w-md">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-vendle-blue hover:bg-vendle-blue/90"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/login'}
            variant="outline"
            className="border-vendle-blue text-vendle-blue"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
