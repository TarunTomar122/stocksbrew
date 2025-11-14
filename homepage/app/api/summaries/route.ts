import { NextResponse } from 'next/server'
import { MongoClient, ServerApi } from 'mongodb'

export async function GET() {
  // MongoDB connection via environment variable
  const uri = process.env.MONGODB_URI as string
  
  if (!uri) {
    return NextResponse.json(
      { error: 'MongoDB URI not configured' },
      { status: 500 }
    )
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: '1' as const,
      strict: true,
      deprecationErrors: true,
    }
  })

  try {
    await client.connect()
    
    const db = client.db('stockbrew_stuff')
    const collection = db.collection('regular_stocks_summaries')
    
    // Get all summaries, sorted by date descending (newest first)
    const summaries = await collection
      .find({})
      .sort({ date: -1 })
      .limit(10) // Limit to last 10 days
      .toArray()
    
    // Transform the data to match our frontend interface
    const transformedSummaries = summaries.map((doc: any) => ({
      date: doc.date,
      summaries: doc.summaries || {}
    }))
    
    return NextResponse.json(transformedSummaries)
  } catch (error) {
    console.error('Error fetching summaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summaries' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
} 