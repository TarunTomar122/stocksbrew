import { MongoClient } from 'mongodb'

interface Summary {
  tldr: string
  sentiment: 'positive' | 'negative' | 'neutral'
  key_points: string[]
  action_items: string[]
}

interface DaySummaries {
  date: string
  summaries: Record<string, Summary>
}

const uri = process.env.MONGODB_URI as string

let client: MongoClient | null = null

async function getMongoClient() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: '1' as const,
        strict: true,
        deprecationErrors: true,
      }
    })
    await client.connect()
  }
  return client
}

export async function getSummaries(): Promise<DaySummaries[]> {
  try {
    const client = await getMongoClient()
    const db = client.db('stockbrew_stuff')
    const collection = db.collection('regular_stocks_summaries')
    
    // Add a timestamp to ensure fresh data fetching
    const now = new Date()
    console.log(`Fetching summaries at: ${now.toISOString()}`)
    
    const summaries = await collection
      .find({})
      .sort({ date: -1 })
      .limit(10)
      .toArray()
    
    return summaries.map((doc: any) => ({
      date: doc.date,
      summaries: doc.summaries || {}
    }))
  } catch (error) {
    console.error('Error fetching summaries:', error)
    return []
  }
} 