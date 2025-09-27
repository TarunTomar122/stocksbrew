import React from 'react'
import Header from '@/components/Header'
import ExploreClient from '@/components/ExploreClient'
import { getSummaries } from '@/lib/mongodb'

// Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400

export default async function ExplorePage() {
  const summaries = await getSummaries()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ExploreClient summaries={summaries} />
    </div>
  )
} 