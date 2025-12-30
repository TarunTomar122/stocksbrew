import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stockName = searchParams.get('stock')
  const days = parseInt(searchParams.get('days') || '30')
  
  if (!stockName) {
    return NextResponse.json(
      { error: 'Stock name is required' },
      { status: 400 }
    )
  }

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
    const summariesCollection = db.collection('regular_stocks_summaries')
    
    // Calculate the date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]
    }
    
    const startDateStr = formatDate(startDate)
    const endDateStr = formatDate(endDate)
    
    // Get all summaries in the date range
    const summaries = await summariesCollection
      .find({
        date: {
          $gte: startDateStr,
          $lte: endDateStr
        }
      })
      .sort({ date: 1 })
      .toArray()
    
    // Extract sentiment data and stock prices for the specific stock
    const sentimentData: Array<{
      date: string
      sentiment_score: number
      sentiment: string
      stock_price?: number
      stock_symbol?: string
    }> = []
    
    for (const doc of summaries) {
      const stockSummary = doc.summaries?.[stockName]
      if (stockSummary && stockSummary.sentiment_score !== undefined) {
        sentimentData.push({
          date: doc.date,
          sentiment_score: stockSummary.sentiment_score,
          sentiment: stockSummary.sentiment,
          stock_price: stockSummary.stock_price || undefined,
          stock_symbol: stockSummary.stock_symbol || undefined
        })
      }
    }
    
    return NextResponse.json({
      stock: stockName,
      dateRange: {
        start: startDateStr,
        end: endDateStr
      },
      sentimentData
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

