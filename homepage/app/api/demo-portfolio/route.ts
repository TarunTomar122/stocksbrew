import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

interface DailyPortfolioValue {
  date: string
  portfolioValue: number
  cash: number
  positionsValue: number
  positions: { [stock: string]: { shares: number; avgPrice: number } }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '30')
  
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
    
    // Demo stocks - Indian stocks only (using INR)
    const DEMO_STOCKS = [
      'Tata Power Company Limited',
      'HDFC Bank Limited',
      'IDFC First Bank Limited',
      'ETERNAL LIMITED',
      'Jio Financial Services Limited',
      'Tata Steel Limited',
      'Sun Pharmaceutical Industries Limited',
      'Hero MotoCorp Limited',
      'VOLTAS',
      'Hindustan Aeronautics Limited',
      'Infosys Limited',
      'Tata Consultancy Services Ltd.',
      'Reliance Industries Limited',
      'TCS',
      'Dr. Reddy\'s Laboratories Limited',
      'BHEL',
      'Hindustan Unilever Ltd.',
      'INFY',
      'Reliance Industries Ltd.'
    ]

    const STARTING_CAPITAL = 50000
    const TRADE_THRESHOLD = 0.3
    const ROLLING_WINDOW = 3
    
    // Get data for the specified time range - go back from TODAY
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days - ROLLING_WINDOW) // Extra days for rolling calculation
    
    console.log('Date range:', { start: startDate, end: endDate, days })
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    
    // Fetch documents with nested summaries structure
    const docs = await summariesCollection
      .find({
        date: {
          $gte: formatDate(startDate),
          $lte: formatDate(endDate)
        }
      })
      .sort({ date: 1 })
      .toArray()
    
    console.log('Found documents:', docs.length)
    
    // Flatten nested structure: {date: "2025-12-30", summaries: {stock1: {...}, stock2: {...}}}
    const stockData: { [stock: string]: any[] } = {}
    for (const doc of docs) {
      const date = doc.date
      const summaries = doc.summaries || {}
      
      for (const stock of DEMO_STOCKS) {
        if (summaries[stock]) {
          const stockSummary = summaries[stock]
          // Only include if has both sentiment_score and stock_price
          if (stockSummary.sentiment_score !== undefined && stockSummary.stock_price) {
            if (!stockData[stock]) stockData[stock] = []
            stockData[stock].push({
              date,
              sentiment_score: stockSummary.sentiment_score,
              stock_price: stockSummary.stock_price,
              company_name: stock
            })
          }
        }
      }
    }
    
    console.log('Found stocks:', Object.keys(stockData))
    console.log('Date range:', formatDate(startDate), 'to', formatDate(endDate))

    // Calculate high accuracy stocks (>50% accuracy over the period)
    const highAccuracyStocks = new Set<string>()
    for (const stock of Object.keys(stockData)) {
      const data = stockData[stock].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      let correct = 0
      let total = 0
      
      for (let i = 0; i < data.length - 1; i++) {
        const current = data[i]
        const next = data[i + 1]
        
        if (current.stock_price && next.stock_price && Math.abs(current.sentiment_score) > TRADE_THRESHOLD) {
          const priceChange = next.stock_price - current.stock_price
          const predictedUp = current.sentiment_score > TRADE_THRESHOLD
          const predictedDown = current.sentiment_score < -TRADE_THRESHOLD
          
          if ((predictedUp && priceChange > 0) || (predictedDown && priceChange < 0)) {
            correct++
          }
          total++
        }
      }
      
      if (total >= 5 && (correct / total) >= 0.5) {
        highAccuracyStocks.add(stock)
      }
    }

    // Calculate 3-day rolling averages and generate signals
    const allSignals: Array<{
      date: string
      stock: string
      avgSentiment: number
      price: number
      signal: 'LONG' | 'SHORT' | 'NEUTRAL'
    }> = []

    for (const stock of Array.from(highAccuracyStocks)) {
      const data = stockData[stock].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      for (let i = ROLLING_WINDOW - 1; i < data.length; i++) {
        const window = data.slice(i - ROLLING_WINDOW + 1, i + 1)
        const avgSentiment = window.reduce((sum, d) => sum + d.sentiment_score, 0) / ROLLING_WINDOW
        const current = data[i]
        
        if (current.stock_price) {
          let signal: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL'
          if (avgSentiment > TRADE_THRESHOLD) signal = 'LONG'
          else if (avgSentiment < -TRADE_THRESHOLD) signal = 'SHORT'
          
          allSignals.push({
            date: current.date,
            stock,
            avgSentiment,
            price: current.stock_price,
            signal
          })
        }
      }
    }

    // Group signals by date
    const signalsByDate: { [date: string]: typeof allSignals } = {}
    for (const signal of allSignals) {
      if (!signalsByDate[signal.date]) signalsByDate[signal.date] = []
      signalsByDate[signal.date].push(signal)
    }

    // Simulate portfolio with dynamic share sizing
    const tradeLog: Array<{
      tradeId: number
      entryDate: string
      exitDate: string | null
      stock: string
      position: 'LONG' | 'SHORT'
      entryPrice: number
      exitPrice: number | null
      profitLoss: number | null
      sentiment: number
      shares: number
      status: 'OPEN' | 'CLOSED'
    }> = []
    
    let cash = STARTING_CAPITAL
    let capitalUsed = 0
    let maxCapitalUsed = 0
    let tradeIdCounter = 1
    
    // Helper function to check if a date is a weekend
    const isWeekend = (dateString: string): boolean => {
      const date = new Date(dateString)
      const dayOfWeek = date.getDay()
      return dayOfWeek === 0 || dayOfWeek === 6 // Sunday = 0, Saturday = 6
    }
    
    // Helper function to determine shares based on sentiment strength
    const getShareCount = (sentiment: number): number => {
      const absSentiment = Math.abs(sentiment)
      if (absSentiment >= 0.9) return 5
      if (absSentiment >= 0.7) return 3
      if (absSentiment >= 0.5) return 2
      if (absSentiment >= 0.3) return 1
      return 0 // Shouldn't happen as we filter for signals
    }
    
    // Map to track open positions
    const openPositions: Map<string, {
      tradeId: number
      entryDate: string
      position: 'LONG' | 'SHORT'
      entryPrice: number
      sentiment: number
      shares: number
    }> = new Map()
    
    const sortedDates = Object.keys(signalsByDate).sort()
    const actualStartDate = formatDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000))
    
    console.log('Sorted dates:', sortedDates.length)
    console.log('Actual start date:', actualStartDate)
    
    for (const date of sortedDates) {
      if (date < actualStartDate) continue
      
      // Skip weekends - markets are closed!
      if (isWeekend(date)) {
        console.log(`Skipping weekend: ${date}`)
        continue
      }
      
      const signals = signalsByDate[date]
      
      // Close existing positions if signal changed or no longer active
      for (const [stock, openPos] of Array.from(openPositions.entries())) {
        const currentSignal = signals.find(s => s.stock === stock)
        const exitPrice = currentSignal?.price || openPos.entryPrice
        
        // Calculate P&L (multiply by shares)
        let profitLossPerShare: number
        if (openPos.position === 'LONG') {
          profitLossPerShare = exitPrice - openPos.entryPrice
        } else {
          // SHORT: profit when price goes down
          profitLossPerShare = openPos.entryPrice - exitPrice
        }
        
        const totalProfitLoss = profitLossPerShare * openPos.shares
        
        // Return capital (shares * entry price)
        const capitalToReturn = openPos.entryPrice * openPos.shares
        cash += capitalToReturn
        capitalUsed -= capitalToReturn
        
        // Add profit/loss to cash
        cash += totalProfitLoss
        
        // Log the closed trade
        const tradeIndex = tradeLog.findIndex(t => t.tradeId === openPos.tradeId)
        if (tradeIndex !== -1) {
          tradeLog[tradeIndex].exitDate = date
          tradeLog[tradeIndex].exitPrice = exitPrice
          tradeLog[tradeIndex].profitLoss = totalProfitLoss
          tradeLog[tradeIndex].status = 'CLOSED'
        }
        
        openPositions.delete(stock)
      }
      
      // Open new positions based on signals (variable shares based on sentiment)
      const activeSignals = signals.filter(s => s.signal !== 'NEUTRAL')
      
      for (const signal of activeSignals) {
        // Skip if already have position in this stock
        if (openPositions.has(signal.stock)) continue
        
        // Determine share count based on sentiment strength
        const shares = getShareCount(signal.avgSentiment)
        const totalCost = signal.price * shares
        
        // Check if we have enough cash to buy the shares
        if (cash >= totalCost) {
          const position: 'LONG' | 'SHORT' = signal.signal as 'LONG' | 'SHORT'
          
          // Deduct capital
          cash -= totalCost
          capitalUsed += totalCost
          
          // Track max capital used
          if (capitalUsed > maxCapitalUsed) {
            maxCapitalUsed = capitalUsed
          }
          
          // Create trade log entry
          tradeLog.push({
            tradeId: tradeIdCounter,
            entryDate: date,
            exitDate: null,
            stock: signal.stock,
            position,
            entryPrice: signal.price,
            exitPrice: null,
            profitLoss: null,
            sentiment: signal.avgSentiment,
            shares,
            status: 'OPEN'
          })
          
          // Track open position
          openPositions.set(signal.stock, {
            tradeId: tradeIdCounter,
            entryDate: date,
            position,
            entryPrice: signal.price,
            sentiment: signal.avgSentiment,
            shares
          })
          
          tradeIdCounter++
        }
      }
    }
    
    // Close any remaining open positions at the end
    const lastDate = sortedDates[sortedDates.length - 1]
    for (const [stock, openPos] of Array.from(openPositions.entries())) {
      const signals = signalsByDate[lastDate]
      const currentSignal = signals?.find(s => s.stock === stock)
      const exitPrice = currentSignal?.price || openPos.entryPrice
      
      let profitLossPerShare: number
      if (openPos.position === 'LONG') {
        profitLossPerShare = exitPrice - openPos.entryPrice
      } else {
        profitLossPerShare = openPos.entryPrice - exitPrice
      }
      
      const totalProfitLoss = profitLossPerShare * openPos.shares
      const capitalToReturn = openPos.entryPrice * openPos.shares
      
      cash += capitalToReturn + totalProfitLoss
      capitalUsed -= capitalToReturn
      
      const tradeIndex = tradeLog.findIndex(t => t.tradeId === openPos.tradeId)
      if (tradeIndex !== -1) {
        tradeLog[tradeIndex].exitDate = lastDate
        tradeLog[tradeIndex].exitPrice = exitPrice
        tradeLog[tradeIndex].profitLoss = totalProfitLoss
        tradeLog[tradeIndex].status = 'CLOSED'
      }
    }
    
    const finalCapital = cash
    const totalProfit = finalCapital - STARTING_CAPITAL
    const closedTrades = tradeLog.filter(t => t.status === 'CLOSED')
    
    // Calculate return on capital actually used
    const returnOnCapitalUsed = maxCapitalUsed > 0 
      ? (totalProfit / maxCapitalUsed) * 100 
      : 0

    return NextResponse.json({
      tradeLog: closedTrades,
      metrics: {
        startingCapital: STARTING_CAPITAL,
        maxCapitalUsed,
        totalProfit,
        returnOnCapitalUsed,
        totalReturn: (totalProfit / STARTING_CAPITAL) * 100,
        totalTrades: closedTrades.length,
        winningTrades: closedTrades.filter(t => (t.profitLoss || 0) > 0).length,
        losingTrades: closedTrades.filter(t => (t.profitLoss || 0) < 0).length,
        highAccuracyStocks: Array.from(highAccuracyStocks),
        stocksUsed: DEMO_STOCKS.filter(s => highAccuracyStocks.has(s))
      }
    })
  } catch (error) {
    console.error('Portfolio simulation error:', error)
    return NextResponse.json(
      { error: 'Failed to simulate portfolio' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

