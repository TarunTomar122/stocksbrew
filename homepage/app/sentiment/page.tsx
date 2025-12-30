import React from 'react'
import Header from '@/components/Header'
import SentimentAnalysisClient from '@/components/SentimentAnalysisClient'
import { getSummaries } from '@/lib/mongodb'

// Force dynamic rendering - always fetch fresh data from DB
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SentimentPage() {
  const summaries = await getSummaries()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SentimentAnalysisClient summaries={summaries}/>
    </div>
  )
}

