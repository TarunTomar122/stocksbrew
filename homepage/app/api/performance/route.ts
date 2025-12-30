import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

interface StockDataPoint {
  date: string
  sentiment_score: number
  sentiment: string
  stock_price?: number
  stock_symbol?: string
}

interface PredictionResult {
  date: string
  stockName: string
  sentiment_score: number
  priceChange: number
  priceChangePercent: number
  wasCorrect: boolean
  prevPrice: number
  nextPrice: number
}

interface StockPerformance {
  stockName: string
  totalPredictions: number
  correctPredictions: number
  accuracy: number
  avgSentiment: number
  avgPriceChange: number
}

interface SmoothedPrediction {
  startDate: string
  endDate: string
  stockName: string
  avgSentiment: number
  priceChangePercent: number
  wasCorrect: boolean
  sentimentDirection: 'bullish' | 'bearish'
}

interface StreakPrediction {
  startDate: string
  endDate: string
  stockName: string
  streakLength: number
  streakDirection: 'positive' | 'negative'
  avgSentiment: number
  priceChangePercent: number
  wasCorrect: boolean
}

// Helper to get week start date (Monday)
function getWeekStart(dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date.setDate(diff))
  return monday.toISOString().split('T')[0]
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
    
    // Get data for the specified time range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    
    const summaries = await summariesCollection
      .find({
        date: {
          $gte: formatDate(startDate),
          $lte: formatDate(endDate)
        }
      })
      .sort({ date: 1 })
      .toArray()
    
    // Build stock-wise data
    const stockData: Record<string, StockDataPoint[]> = {}
    
    for (const doc of summaries) {
      const date = doc.date
      const stockSummaries = doc.summaries || {}
      
      for (const [stockName, summary] of Object.entries(stockSummaries) as [string, any][]) {
        if (summary.sentiment_score !== undefined && summary.stock_price !== undefined) {
          if (!stockData[stockName]) {
            stockData[stockName] = []
          }
          stockData[stockName].push({
            date,
            sentiment_score: summary.sentiment_score,
            sentiment: summary.sentiment,
            stock_price: summary.stock_price,
            stock_symbol: summary.stock_symbol
          })
        }
      }
    }
    
    // Calculate predictions and accuracy
    const allPredictions: PredictionResult[] = []
    const stockPerformances: StockPerformance[] = []
    
    let totalPredictions = 0
    let correctPredictions = 0
    let positiveSentimentCorrect = 0
    let positiveSentimentTotal = 0
    let negativeSentimentCorrect = 0
    let negativeSentimentTotal = 0
    
    // Sentiment score ranges for analysis
    const sentimentBuckets = {
      strongPositive: { correct: 0, total: 0, range: [0.5, 1] },
      mildPositive: { correct: 0, total: 0, range: [0.1, 0.5] },
      neutral: { correct: 0, total: 0, range: [-0.1, 0.1] },
      mildNegative: { correct: 0, total: 0, range: [-0.5, -0.1] },
      strongNegative: { correct: 0, total: 0, range: [-1, -0.5] }
    }
    
    for (const [stockName, dataPoints] of Object.entries(stockData)) {
      // Sort by date
      dataPoints.sort((a, b) => a.date.localeCompare(b.date))
      
      let stockCorrect = 0
      let stockTotal = 0
      let stockSentimentSum = 0
      let stockPriceChangeSum = 0
      
      for (let i = 0; i < dataPoints.length - 1; i++) {
        const current = dataPoints[i]
        const next = dataPoints[i + 1]
        
        if (current.stock_price && next.stock_price && current.stock_price > 0) {
          const priceChange = next.stock_price - current.stock_price
          const priceChangePercent = (priceChange / current.stock_price) * 100
          
          // Prediction logic: positive sentiment should predict price increase
          // Only count as prediction if sentiment is strong enough (>= 0.3)
          const sentimentPredictedUp = current.sentiment_score >= 0.3
          const sentimentPredictedDown = current.sentiment_score <= -0.3
          const priceWentUp = priceChange > 0
          const priceWentDown = priceChange < 0
          
          // Only count as prediction if sentiment was not neutral
          if (sentimentPredictedUp || sentimentPredictedDown) {
            const wasCorrect = (sentimentPredictedUp && priceWentUp) || 
                              (sentimentPredictedDown && priceWentDown)
            
            allPredictions.push({
              date: current.date,
              stockName,
              sentiment_score: current.sentiment_score,
              priceChange,
              priceChangePercent,
              wasCorrect,
              prevPrice: current.stock_price,
              nextPrice: next.stock_price
            })
            
            totalPredictions++
            stockTotal++
            stockSentimentSum += current.sentiment_score
            stockPriceChangeSum += priceChangePercent
            
            if (wasCorrect) {
              correctPredictions++
              stockCorrect++
            }
            
            // Track by sentiment direction
            if (sentimentPredictedUp) {
              positiveSentimentTotal++
              if (priceWentUp) positiveSentimentCorrect++
            } else if (sentimentPredictedDown) {
              negativeSentimentTotal++
              if (priceWentDown) negativeSentimentCorrect++
            }
            
            // Track by sentiment strength
            const score = current.sentiment_score
            if (score >= 0.5) {
              sentimentBuckets.strongPositive.total++
              if (wasCorrect) sentimentBuckets.strongPositive.correct++
            } else if (score >= 0.1) {
              sentimentBuckets.mildPositive.total++
              if (wasCorrect) sentimentBuckets.mildPositive.correct++
            } else if (score > -0.1) {
              sentimentBuckets.neutral.total++
              if (wasCorrect) sentimentBuckets.neutral.correct++
            } else if (score > -0.5) {
              sentimentBuckets.mildNegative.total++
              if (wasCorrect) sentimentBuckets.mildNegative.correct++
            } else {
              sentimentBuckets.strongNegative.total++
              if (wasCorrect) sentimentBuckets.strongNegative.correct++
            }
          }
        }
      }
      
      if (stockTotal > 0) {
        stockPerformances.push({
          stockName,
          totalPredictions: stockTotal,
          correctPredictions: stockCorrect,
          accuracy: (stockCorrect / stockTotal) * 100,
          avgSentiment: stockSentimentSum / stockTotal,
          avgPriceChange: stockPriceChangeSum / stockTotal
        })
      }
    }
    
    // Sort predictions by impact for best/worst
    const sortedByImpact = [...allPredictions].sort((a, b) => 
      Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent)
    )
    
    const bestPredictions = sortedByImpact
      .filter(p => p.wasCorrect)
      .slice(0, 5)
    
    const worstPredictions = sortedByImpact
      .filter(p => !p.wasCorrect)
      .slice(0, 5)
    
    // Sort stocks by accuracy (minimum 5 predictions for statistical significance)
    const topPerformingStocks = [...stockPerformances]
      .filter(s => s.totalPredictions >= 5)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5)
    
    const worstPerformingStocks = [...stockPerformances]
      .filter(s => s.totalPredictions >= 5)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)
    
    // Calculate daily accuracy trend
    const dailyAccuracy: { date: string; accuracy: number; total: number }[] = []
    const predictionsByDate: Record<string, { correct: number; total: number }> = {}
    
    for (const pred of allPredictions) {
      if (!predictionsByDate[pred.date]) {
        predictionsByDate[pred.date] = { correct: 0, total: 0 }
      }
      predictionsByDate[pred.date].total++
      if (pred.wasCorrect) {
        predictionsByDate[pred.date].correct++
      }
    }
    
    for (const [date, stats] of Object.entries(predictionsByDate).sort((a, b) => a[0].localeCompare(b[0]))) {
      dailyAccuracy.push({
        date,
        accuracy: (stats.correct / stats.total) * 100,
        total: stats.total
      })
    }
    
    // Calculate sentiment bucket accuracies
    const bucketAccuracies = Object.entries(sentimentBuckets).map(([name, data]) => ({
      name,
      accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
      total: data.total,
      correct: data.correct
    }))
    
    // ============================================
    // SMOOTHED PREDICTIONS - Rolling 3-day windows
    // ============================================
    const smoothedPredictions: SmoothedPrediction[] = []
    let smoothedCorrect = 0
    let smoothedTotal = 0
    
    for (const [stockName, dataPoints] of Object.entries(stockData)) {
      dataPoints.sort((a, b) => a.date.localeCompare(b.date))
      
      // Need at least 6 days: 3 for sentiment window + 3 for price change window
      for (let i = 0; i <= dataPoints.length - 6; i++) {
        const sentimentWindow = dataPoints.slice(i, i + 3)
        const priceWindow = dataPoints.slice(i + 3, i + 6)
        
        // Check all have prices
        if (!sentimentWindow.every(d => d.stock_price) || !priceWindow.every(d => d.stock_price)) continue
        
        const avgSentiment = sentimentWindow.reduce((sum, d) => sum + d.sentiment_score, 0) / 3
        const startPrice = sentimentWindow[0].stock_price!
        const endPrice = priceWindow[priceWindow.length - 1].stock_price!
        const priceChangePercent = ((endPrice - startPrice) / startPrice) * 100
        
        // Only count if sentiment is meaningful (not neutral)
        if (Math.abs(avgSentiment) > 0.1) {
          const sentimentDirection = avgSentiment > 0 ? 'bullish' : 'bearish'
          const wasCorrect = (avgSentiment > 0 && priceChangePercent > 0) || 
                            (avgSentiment < 0 && priceChangePercent < 0)
          
          smoothedPredictions.push({
            startDate: sentimentWindow[0].date,
            endDate: priceWindow[priceWindow.length - 1].date,
            stockName,
            avgSentiment,
            priceChangePercent,
            wasCorrect,
            sentimentDirection
          })
          
          smoothedTotal++
          if (wasCorrect) smoothedCorrect++
        }
      }
    }
    
    // ============================================
    // STREAK PREDICTIONS - 3+ consecutive same-direction days
    // ============================================
    const streakPredictions: StreakPrediction[] = []
    let streakCorrect = 0
    let streakTotal = 0
    
    for (const [stockName, dataPoints] of Object.entries(stockData)) {
      dataPoints.sort((a, b) => a.date.localeCompare(b.date))
      
      let streakStart = 0
      let currentDirection: 'positive' | 'negative' | null = null
      
      for (let i = 0; i < dataPoints.length; i++) {
        const score = dataPoints[i].sentiment_score
        const direction = score >= 0.3 ? 'positive' : score <= -0.3 ? 'negative' : null
        
        if (direction === null || direction !== currentDirection) {
          // Check if we had a valid streak (3+ days)
          const streakLength = i - streakStart
          if (streakLength >= 3 && currentDirection !== null) {
            // Get price change after the streak
            const streakData = dataPoints.slice(streakStart, i)
            const nextDayIndex = i
            
            if (nextDayIndex < dataPoints.length && 
                streakData[0].stock_price && 
                dataPoints[nextDayIndex].stock_price) {
              
              const avgSentiment = streakData.reduce((sum, d) => sum + d.sentiment_score, 0) / streakLength
              const priceChangePercent = ((dataPoints[nextDayIndex].stock_price! - streakData[0].stock_price!) / streakData[0].stock_price!) * 100
              
              const wasCorrect = (currentDirection === 'positive' && priceChangePercent > 0) ||
                                (currentDirection === 'negative' && priceChangePercent < 0)
              
              streakPredictions.push({
                startDate: streakData[0].date,
                endDate: streakData[streakLength - 1].date,
                stockName,
                streakLength,
                streakDirection: currentDirection,
                avgSentiment,
                priceChangePercent,
                wasCorrect
              })
              
              streakTotal++
              if (wasCorrect) streakCorrect++
            }
          }
          
          // Start new potential streak
          streakStart = i
          currentDirection = direction
        }
      }
    }
    
    // ============================================
    // STRONG SIGNALS ONLY (|sentiment| >= 0.5)
    // ============================================
    const strongSignals = allPredictions.filter(p => Math.abs(p.sentiment_score) >= 0.5)
    const strongSignalCorrect = strongSignals.filter(p => p.wasCorrect).length
    const strongSignalAccuracy = strongSignals.length > 0 
      ? (strongSignalCorrect / strongSignals.length) * 100 
      : 0
    
    // ============================================
    // WEEKLY AGGREGATES
    // ============================================
    interface WeeklyData {
      week: string
      avgSentiment: number
      priceChangePercent: number
      stockCount: number
    }
    
    const weeklyMap: Record<string, { sentiments: number[], priceChanges: number[] }> = {}
    
    for (const pred of allPredictions) {
      const weekStart = getWeekStart(pred.date)
      if (!weeklyMap[weekStart]) {
        weeklyMap[weekStart] = { sentiments: [], priceChanges: [] }
      }
      weeklyMap[weekStart].sentiments.push(pred.sentiment_score)
      weeklyMap[weekStart].priceChanges.push(pred.priceChangePercent)
    }
    
    const weeklyData: WeeklyData[] = Object.entries(weeklyMap)
      .map(([week, data]) => ({
        week,
        avgSentiment: data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length,
        priceChangePercent: data.priceChanges.reduce((a, b) => a + b, 0) / data.priceChanges.length,
        stockCount: data.sentiments.length
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
    
    // Weekly accuracy
    let weeklyCorrect = 0
    let weeklyTotal = 0
    for (const week of weeklyData) {
      if (Math.abs(week.avgSentiment) >= 0.2) {
        weeklyTotal++
        if ((week.avgSentiment > 0 && week.priceChangePercent > 0) ||
            (week.avgSentiment < 0 && week.priceChangePercent < 0)) {
          weeklyCorrect++
        }
      }
    }
    
    // ============================================
    // RETURNS SIMULATION - Long/Short Trading Strategy
    // ============================================
    
    const TRADE_THRESHOLD = 0.3 // Only trade if sentiment > 0.3 or < -0.3
    const highAccuracyStocks = new Set(
      stockPerformances.filter(s => s.accuracy >= 50 && s.totalPredictions >= 5).map(s => s.stockName)
    )
    
    // Helper function to calculate returns for a strategy
    const calculateStrategyReturns = (
      predictions: (PredictionResult & { avgSentiment?: number })[],
      useAvgSentiment: boolean = false,
      highAccuracyOnly: boolean = false
    ) => {
      let totalReturn = 0
      let totalTrades = 0
      const tradesWithReturns: (PredictionResult & { actualReturn: number; tradeSentiment: number })[] = []
      
      for (const pred of predictions) {
        // Skip if high accuracy filter is on and stock doesn't qualify
        if (highAccuracyOnly && !highAccuracyStocks.has(pred.stockName)) {
          continue
        }
        
        const sentiment = useAvgSentiment ? (pred.avgSentiment || pred.sentiment_score) : pred.sentiment_score
        const priceChangePercent = pred.priceChangePercent
        let actualReturn = 0
        
        // Determine position and calculate actual return
        if (sentiment > TRADE_THRESHOLD) {
          // LONG position: profit when price goes up
          actualReturn = priceChangePercent
        } else if (sentiment < -TRADE_THRESHOLD) {
          // SHORT position: profit when price goes down (flip the sign!)
          actualReturn = -priceChangePercent
        } else {
          // Neutral sentiment: no trade
          continue
        }
        
        // Track this trade
        tradesWithReturns.push({ ...pred, actualReturn, tradeSentiment: sentiment })
        totalReturn += actualReturn
        totalTrades++
      }
      
      const avgReturn = totalTrades > 0 ? totalReturn / totalTrades : 0
      const cumulativeReturn = totalTrades > 0 ? (Math.pow(1 + avgReturn / 100, totalTrades) - 1) * 100 : 0
      
      return {
        totalReturn,
        avgReturnPerTrade: avgReturn,
        cumulativeReturn,
        trades: totalTrades,
        tradesWithReturns
      }
    }
    
    // Calculate 3-day and 5-day rolling averages
    const calculateRollingPredictions = (windowSize: number) => {
      const rollingPredictions: (PredictionResult & { avgSentiment: number })[] = []
      
      for (const stock of Object.keys(stockData)) {
        const sortedDates = stockData[stock].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        
        for (let i = windowSize - 1; i < sortedDates.length; i++) {
          const window = sortedDates.slice(i - windowSize + 1, i + 1)
          const avgSentiment = window.reduce((sum, d) => sum + d.sentiment_score, 0) / window.length
          
          const current = sortedDates[i]
          const next = sortedDates[i + 1]
          
          if (next && next.stock_price && current.stock_price) {
            const priceChange = next.stock_price - current.stock_price
            const priceChangePercent = (priceChange / current.stock_price) * 100
            
            rollingPredictions.push({
              date: current.date,
              stockName: stock,
              sentiment_score: current.sentiment_score,
              avgSentiment: avgSentiment,
              priceChange,
              priceChangePercent,
              wasCorrect: (avgSentiment > 0 && priceChange > 0) || (avgSentiment < 0 && priceChange < 0),
              prevPrice: current.stock_price,
              nextPrice: next.stock_price
            })
          }
        }
      }
      
      return rollingPredictions
    }
    
    const rolling3DayPredictions = calculateRollingPredictions(3)
    const rolling5DayPredictions = calculateRollingPredictions(5)
    
    // Calculate returns for each strategy
    // Daily strategies
    const dailyAllStocks = calculateStrategyReturns(allPredictions, false, false)
    const dailyHighAccuracy = calculateStrategyReturns(allPredictions, false, true)
    
    // 3-Day rolling average strategies
    const rolling3DayAllStocks = calculateStrategyReturns(rolling3DayPredictions, true, false)
    const rolling3DayHighAccuracy = calculateStrategyReturns(rolling3DayPredictions, true, true)
    
    // 5-Day rolling average strategies
    const rolling5DayAllStocks = calculateStrategyReturns(rolling5DayPredictions, true, false)
    const rolling5DayHighAccuracy = calculateStrategyReturns(rolling5DayPredictions, true, true)
    
    return NextResponse.json({
      overview: {
        totalPredictions,
        correctPredictions,
        overallAccuracy: totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0,
        positiveSentimentAccuracy: positiveSentimentTotal > 0 ? (positiveSentimentCorrect / positiveSentimentTotal) * 100 : 0,
        negativeSentimentAccuracy: negativeSentimentTotal > 0 ? (negativeSentimentCorrect / negativeSentimentTotal) * 100 : 0,
        positiveSentimentTotal,
        negativeSentimentTotal,
        totalStocksAnalyzed: Object.keys(stockData).length,
        dateRange: {
          start: formatDate(startDate),
          end: formatDate(endDate)
        }
      },
      bestPredictions,
      worstPredictions,
      topPerformingStocks,
      worstPerformingStocks,
      dailyAccuracy,
      bucketAccuracies,
      allStockPerformances: stockPerformances
        .filter(s => s.totalPredictions >= 5)
        .sort((a, b) => b.accuracy - a.accuracy),
      // Returns simulation with different strategies
      returns: {
        daily: {
          allStocks: {
            totalReturn: dailyAllStocks.totalReturn,
            avgReturnPerTrade: dailyAllStocks.avgReturnPerTrade,
            cumulativeReturn: dailyAllStocks.cumulativeReturn,
            trades: dailyAllStocks.trades,
            bestTrades: dailyAllStocks.tradesWithReturns.sort((a, b) => b.actualReturn - a.actualReturn).slice(0, 5),
            worstTrades: dailyAllStocks.tradesWithReturns.sort((a, b) => a.actualReturn - b.actualReturn).slice(0, 5)
          },
          highAccuracy: {
            totalReturn: dailyHighAccuracy.totalReturn,
            avgReturnPerTrade: dailyHighAccuracy.avgReturnPerTrade,
            cumulativeReturn: dailyHighAccuracy.cumulativeReturn,
            trades: dailyHighAccuracy.trades,
            stockCount: highAccuracyStocks.size,
            bestTrades: dailyHighAccuracy.tradesWithReturns.sort((a, b) => b.actualReturn - a.actualReturn).slice(0, 5),
            worstTrades: dailyHighAccuracy.tradesWithReturns.sort((a, b) => a.actualReturn - b.actualReturn).slice(0, 5)
          }
        },
        rolling3Day: {
          allStocks: {
            totalReturn: rolling3DayAllStocks.totalReturn,
            avgReturnPerTrade: rolling3DayAllStocks.avgReturnPerTrade,
            cumulativeReturn: rolling3DayAllStocks.cumulativeReturn,
            trades: rolling3DayAllStocks.trades,
            bestTrades: rolling3DayAllStocks.tradesWithReturns.sort((a, b) => b.actualReturn - a.actualReturn).slice(0, 5),
            worstTrades: rolling3DayAllStocks.tradesWithReturns.sort((a, b) => a.actualReturn - b.actualReturn).slice(0, 5)
          },
          highAccuracy: {
            totalReturn: rolling3DayHighAccuracy.totalReturn,
            avgReturnPerTrade: rolling3DayHighAccuracy.avgReturnPerTrade,
            cumulativeReturn: rolling3DayHighAccuracy.cumulativeReturn,
            trades: rolling3DayHighAccuracy.trades,
            stockCount: highAccuracyStocks.size,
            bestTrades: rolling3DayHighAccuracy.tradesWithReturns.sort((a, b) => b.actualReturn - a.actualReturn).slice(0, 5),
            worstTrades: rolling3DayHighAccuracy.tradesWithReturns.sort((a, b) => a.actualReturn - b.actualReturn).slice(0, 5)
          }
        },
        rolling5Day: {
          allStocks: {
            totalReturn: rolling5DayAllStocks.totalReturn,
            avgReturnPerTrade: rolling5DayAllStocks.avgReturnPerTrade,
            cumulativeReturn: rolling5DayAllStocks.cumulativeReturn,
            trades: rolling5DayAllStocks.trades,
            bestTrades: rolling5DayAllStocks.tradesWithReturns.sort((a, b) => b.actualReturn - a.actualReturn).slice(0, 5),
            worstTrades: rolling5DayAllStocks.tradesWithReturns.sort((a, b) => a.actualReturn - b.actualReturn).slice(0, 5)
          },
          highAccuracy: {
            totalReturn: rolling5DayHighAccuracy.totalReturn,
            avgReturnPerTrade: rolling5DayHighAccuracy.avgReturnPerTrade,
            cumulativeReturn: rolling5DayHighAccuracy.cumulativeReturn,
            trades: rolling5DayHighAccuracy.trades,
            stockCount: highAccuracyStocks.size,
            bestTrades: rolling5DayHighAccuracy.tradesWithReturns.sort((a, b) => b.actualReturn - a.actualReturn).slice(0, 5),
            worstTrades: rolling5DayHighAccuracy.tradesWithReturns.sort((a, b) => a.actualReturn - b.actualReturn).slice(0, 5)
          }
        }
      },
      // Smoothed metrics
      smoothed: {
        rollingWindow: {
          accuracy: smoothedTotal > 0 ? (smoothedCorrect / smoothedTotal) * 100 : 0,
          total: smoothedTotal,
          correct: smoothedCorrect,
          predictions: smoothedPredictions.slice(0, 10) // Top 10 for display
        },
        streaks: {
          accuracy: streakTotal > 0 ? (streakCorrect / streakTotal) * 100 : 0,
          total: streakTotal,
          correct: streakCorrect,
          predictions: streakPredictions.sort((a, b) => b.streakLength - a.streakLength).slice(0, 10)
        },
        strongSignals: {
          accuracy: strongSignalAccuracy,
          total: strongSignals.length,
          correct: strongSignalCorrect,
          threshold: 0.5
        },
        weekly: {
          accuracy: weeklyTotal > 0 ? (weeklyCorrect / weeklyTotal) * 100 : 0,
          total: weeklyTotal,
          correct: weeklyCorrect,
          data: weeklyData
        }
      }
    })
  } catch (error) {
    console.error('Error calculating performance:', error)
    return NextResponse.json(
      { error: 'Failed to calculate performance metrics' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

