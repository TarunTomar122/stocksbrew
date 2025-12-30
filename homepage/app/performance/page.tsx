import React from 'react'
import Header from '@/components/Header'
import PerformanceAnalyticsClient from '@/components/PerformanceAnalyticsClient'

// Force dynamic rendering - always fetch fresh data from DB
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <PerformanceAnalyticsClient />
      </div>
    </div>
  )
}

