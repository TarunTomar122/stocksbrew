'use client'

import React, { useState, useEffect } from 'react'

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

interface BucketAccuracy {
  name: string
  accuracy: number
  total: number
  correct: number
}

interface DailyAccuracy {
  date: string
  accuracy: number
  total: number
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

interface WeeklyData {
  week: string
  avgSentiment: number
  priceChangePercent: number
  stockCount: number
}

interface SmoothedMetrics {
  rollingWindow: {
    accuracy: number
    total: number
    correct: number
    predictions: SmoothedPrediction[]
  }
  streaks: {
    accuracy: number
    total: number
    correct: number
    predictions: StreakPrediction[]
  }
  strongSignals: {
    accuracy: number
    total: number
    correct: number
    threshold: number
  }
  weekly: {
    accuracy: number
    total: number
    correct: number
    data: WeeklyData[]
  }
}

interface StrategyResult {
  totalReturn: number
  avgReturnPerTrade: number
  cumulativeReturn: number
  trades: number
  stockCount?: number
  bestTrades: (PredictionResult & { actualReturn: number; tradeSentiment: number })[]
  worstTrades: (PredictionResult & { actualReturn: number; tradeSentiment: number })[]
}

interface ReturnsData {
  daily: {
    allStocks: StrategyResult
    highAccuracy: StrategyResult
  }
  rolling3Day: {
    allStocks: StrategyResult
    highAccuracy: StrategyResult
  }
  rolling5Day: {
    allStocks: StrategyResult
    highAccuracy: StrategyResult
  }
}

interface PerformanceData {
  overview: {
    totalPredictions: number
    correctPredictions: number
    overallAccuracy: number
    positiveSentimentAccuracy: number
    negativeSentimentAccuracy: number
    positiveSentimentTotal: number
    negativeSentimentTotal: number
    totalStocksAnalyzed: number
    dateRange: {
      start: string
      end: string
    }
  }
  bestPredictions: PredictionResult[]
  worstPredictions: PredictionResult[]
  topPerformingStocks: StockPerformance[]
  worstPerformingStocks: StockPerformance[]
  dailyAccuracy: DailyAccuracy[]
  bucketAccuracies: BucketAccuracy[]
  allStockPerformances: StockPerformance[]
  smoothed: SmoothedMetrics
  returns: ReturnsData
}

interface PortfolioMetrics {
  tradeLog: Array<{
    tradeId: number
    entryDate: string
    exitDate: string
    stock: string
    position: 'LONG' | 'SHORT'
    entryPrice: number
    exitPrice: number
    profitLoss: number
    sentiment: number
    shares: number
    status: 'CLOSED'
  }>
  metrics: {
    startingCapital: number
    maxCapitalUsed: number
    totalProfit: number
    returnOnCapitalUsed: number
    totalReturn: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
    highAccuracyStocks: string[]
    stocksUsed: string[]
  }
}

export default function PerformanceAnalyticsClient() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [portfolioData, setPortfolioData] = useState<PortfolioMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'returns' | 'stocks' | 'portfolio'>('overview')
  const [timeRange, setTimeRange] = useState<30 | 'all'>(30)
  const [smoothingMethod, setSmoothingMethod] = useState<'daily' | 'rolling3Day' | 'rolling5Day'>('daily')

  useEffect(() => {
    fetchPerformanceData()
  }, [timeRange])

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      const days = timeRange === 'all' ? 365 : timeRange
      const [perfResponse, portfolioResponse] = await Promise.all([
        fetch(`/api/performance?days=${days}`),
        fetch(`/api/demo-portfolio?days=${days}`)
      ])
      if (!perfResponse.ok) throw new Error('Failed to fetch performance data')
      if (!portfolioResponse.ok) throw new Error('Failed to fetch portfolio data')
      const perfResult = await perfResponse.json()
      const portfolioResult = await portfolioResponse.json()
      setData(perfResult)
      setPortfolioData(portfolioResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Helper to determine currency symbol based on stock name
  const getCurrencySymbol = (stockName: string) => {
    // List of US stocks
    const usStocks = ['GOOGL', 'AAPL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'INTC']
    return usStocks.includes(stockName) ? '$' : '₹'
  }

  const formatPrice = (price: number, stockName: string) => {
    const symbol = getCurrencySymbol(stockName)
    return `${symbol}${price.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatCurrency = (value: number, symbol: string = '$') => {
    return `${symbol}${value.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Crunching the numbers...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load analytics</h3>
          <p className="text-gray-600">{error || 'No data available'}</p>
        </div>
      </div>
    )
  }

  const { overview, bestPredictions, worstPredictions, topPerformingStocks, worstPerformingStocks, dailyAccuracy, bucketAccuracies, smoothed } = data

  // Chart dimensions
  const chartWidth = 800
  const chartHeight = 200
  const padding = { top: 20, right: 40, bottom: 40, left: 50 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Accuracy trend chart
  const xScale = (index: number) => {
    if (dailyAccuracy.length <= 1) return padding.left + innerWidth / 2
    return padding.left + (index / (dailyAccuracy.length - 1)) * innerWidth
  }
  
  const yScale = (value: number) => {
    return padding.top + innerHeight - (value / 100) * innerHeight
  }

  const accuracyPath = dailyAccuracy.map((d, i) => {
    const x = xScale(i)
    const y = yScale(d.accuracy)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')

  const areaPath = accuracyPath + 
    ` L ${xScale(dailyAccuracy.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`

  // Bucket labels mapping
  const bucketLabels: Record<string, string> = {
    strongPositive: 'Strong +ve (0.5 to 1.0)',
    mildPositive: 'Mild +ve (0.1 to 0.5)',
    neutral: 'Neutral (-0.1 to 0.1)',
    mildNegative: 'Mild -ve (-0.5 to -0.1)',
    strongNegative: 'Strong -ve (-1.0 to -0.5)'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Pipeline Performance</h1>
            <p className="text-gray-600">
              How well did our AI sentiment analysis predict stock price movements?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Analyzing {overview.totalStocksAnalyzed} stocks from {formatDate(overview.dateRange.start)} to {formatDate(overview.dateRange.end)}
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange(30)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 30 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5">
          <div className="text-sm text-gray-500 mb-1">When Bullish 📈</div>
          <div className={`text-3xl font-bold ${overview.positiveSentimentAccuracy >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
            {overview.positiveSentimentAccuracy.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {overview.positiveSentimentTotal} predictions
          </div>
        </div>

        <div className="bg-white p-5">
          <div className="text-sm text-gray-500 mb-1">When Bearish 📉</div>
          <div className={`text-3xl font-bold ${overview.negativeSentimentAccuracy >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
            {overview.negativeSentimentAccuracy.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {overview.negativeSentimentTotal} predictions
          </div>
        </div>

        <div className="bg-white p-5">
          <div className="text-sm text-gray-500 mb-1">Stocks Analyzed</div>
          <div className="text-3xl font-bold text-gray-900">
            {overview.totalStocksAnalyzed}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            unique stocks
          </div>
        </div>

        <div className="bg-white p-5">
          <div className="text-sm text-gray-500 mb-1">Total Data Points</div>
          <div className="text-3xl font-bold text-gray-900">
            {overview.totalPredictions}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            sentiment-price pairs
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-black text-black' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('stocks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'stocks' 
              ? 'border-black text-black' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          By Stock
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'returns' 
              ? 'border-black text-black' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Returns
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'portfolio' 
              ? 'border-black text-black' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Portfolio Sim
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Accuracy Improvement Visualization */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-2">Accuracy by Method</h3>
            <p className="text-sm text-gray-500 mb-6">
              Comparing how different time windows affect prediction accuracy
            </p>
            <div className="space-y-4">
              {[
                { label: 'Daily (≥0.3)', accuracy: overview.overallAccuracy, total: overview.totalPredictions },
                { label: '3-Day Average', accuracy: smoothed.rollingWindow.accuracy, total: smoothed.rollingWindow.total },
                { label: '3+ Day Streaks', accuracy: smoothed.streaks.accuracy, total: smoothed.streaks.total },
                { label: 'Strong Signals (≥0.5)', accuracy: smoothed.strongSignals.accuracy, total: smoothed.strongSignals.total }
              ].map((method) => (
                <div key={method.label} className="flex items-center gap-4">
                  <div className="w-40 text-sm font-medium text-gray-700">{method.label}</div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-100 relative overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          method.accuracy >= 50 ? 'bg-green-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.max(method.accuracy, 2)}%` }}
                      />
                      {/* 50% marker */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400" />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className={`text-lg font-bold ${method.accuracy >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                      {method.accuracy.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400">{method.total} pred.</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 bg-gray-400 mr-1 align-middle" /> 50% line = random chance
            </div>
          </div>

          {/* Insights Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Best Performing Method */}
            <div className="bg-green-50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎯</span>
                <h3 className="text-lg font-semibold text-gray-900">Best Method</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {(() => {
                  const methods = [
                    { name: '3-Day Average', accuracy: smoothed.rollingWindow.accuracy },
                    { name: '3+ Day Streaks', accuracy: smoothed.streaks.accuracy },
                    { name: 'Strong Signals', accuracy: smoothed.strongSignals.accuracy }
                  ]
                  const best = methods.reduce((max, m) => m.accuracy > max.accuracy ? m : max)
                  return (
                    <>
                      <span className="font-semibold text-green-700">{best.name}</span> performs best at{' '}
                      <span className="font-bold text-green-700">{best.accuracy.toFixed(0)}%</span> accuracy
                    </>
                  )
                })()}
              </p>
              <p className="text-xs text-gray-500">
                {smoothed.rollingWindow.accuracy > overview.overallAccuracy 
                  ? `That's ${(smoothed.rollingWindow.accuracy - overview.overallAccuracy).toFixed(0)}% better than daily predictions`
                  : 'Daily predictions are performing well'}
              </p>
            </div>

            {/* Bullish vs Bearish */}
            <div className="bg-blue-50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚖️</span>
                <h3 className="text-lg font-semibold text-gray-900">Prediction Balance</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Better at predicting{' '}
                <span className="font-semibold text-blue-700">
                  {overview.positiveSentimentAccuracy > overview.negativeSentimentAccuracy ? 'bullish' : 'bearish'}
                </span>{' '}
                movements
              </p>
              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Bullish:</span>{' '}
                  <span className="font-semibold">{overview.positiveSentimentAccuracy.toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Bearish:</span>{' '}
                  <span className="font-semibold">{overview.negativeSentimentAccuracy.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Accuracy Trend */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Accuracy Trend</h3>
            {dailyAccuracy.length > 0 ? (
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[600px]">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map(value => (
                    <g key={value}>
                      <line
                        x1={padding.left}
                        y1={yScale(value)}
                        x2={chartWidth - padding.right}
                        y2={yScale(value)}
                        stroke={value === 50 ? '#d1d5db' : '#f3f4f6'}
                        strokeWidth={value === 50 ? 1.5 : 1}
                        strokeDasharray={value === 50 ? '5,5' : '0'}
                      />
                      <text
                        x={padding.left - 10}
                        y={yScale(value)}
                        textAnchor="end"
                        alignmentBaseline="middle"
                        fontSize="11"
                        fill="#6b7280"
                      >
                        {value}%
                      </text>
                    </g>
                  ))}

                  {/* Area fill */}
                  <path
                    d={areaPath}
                    fill="url(#accuracyGradient)"
                    opacity="0.3"
                  />

                  {/* Line */}
                  <path
                    d={accuracyPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {dailyAccuracy.map((d, i) => (
                    <circle
                      key={i}
                      cx={xScale(i)}
                      cy={yScale(d.accuracy)}
                      r="4"
                      fill={d.accuracy >= 50 ? '#10b981' : '#ef4444'}
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}

                  {/* X-axis labels */}
                  {dailyAccuracy.map((d, i) => {
                    const step = Math.max(1, Math.ceil(dailyAccuracy.length / 8))
                    if (i % step === 0 || i === dailyAccuracy.length - 1) {
                      return (
                        <text
                          key={i}
                          x={xScale(i)}
                          y={chartHeight - 10}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#6b7280"
                        >
                          {formatDate(d.date)}
                        </text>
                      )
                    }
                    return null
                  })}

                  <defs>
                    <linearGradient id="accuracyGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No daily accuracy data available</p>
            )}
          </div>

          {/* Accuracy by Sentiment Strength */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Accuracy by Sentiment Strength</h3>
            <p className="text-sm text-gray-500 mb-4">
              Does stronger sentiment lead to better predictions?
            </p>
            <div className="space-y-3">
              {bucketAccuracies.map((bucket) => (
                <div key={bucket.name} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-gray-600 truncate">
                    {bucketLabels[bucket.name] || bucket.name}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          bucket.accuracy >= 60 ? 'bg-green-500' : 
                          bucket.accuracy >= 50 ? 'bg-amber-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.max(bucket.accuracy, 2)}%` }}
                      />
                      {/* 50% marker */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300" />
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className={`font-semibold ${
                      bucket.accuracy >= 50 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {bucket.accuracy.toFixed(0)}%
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      ({bucket.total})
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-1 align-middle" /> 50% line = random chance
            </div>
          </div>
        </div>
      )}

      {activeTab === 'returns' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-2">Hypothetical Trading Returns</h3>
            <p className="text-sm text-gray-500 mb-4">
              What if you traded using a long/short strategy? When sentiment is <strong>positive (&gt;0.3)</strong>, we go <strong className="text-green-600">LONG</strong> (profit from price increases). 
              When sentiment is <strong>negative (&lt;-0.3)</strong>, we go <strong className="text-red-600">SHORT</strong> (profit from price decreases). 
            </p>
            
            {/* Smoothing Method Selector */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSmoothingMethod('daily')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  smoothingMethod === 'daily'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Daily Signals
              </button>
              <button
                onClick={() => setSmoothingMethod('rolling3Day')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  smoothingMethod === 'rolling3Day'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                3-Day Rolling Average
              </button>
              <button
                onClick={() => setSmoothingMethod('rolling5Day')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  smoothingMethod === 'rolling5Day'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                5-Day Rolling Average
              </button>
            </div>
          </div>

          {/* Strategy Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* All Stocks Strategy */}
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📊</span>
                <h3 className="font-semibold text-gray-900">All Stocks</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                {smoothingMethod === 'daily' && 'Trade every day based on daily sentiment signals'}
                {smoothingMethod === 'rolling3Day' && 'Trade based on 3-day average sentiment (smoother signals)'}
                {smoothingMethod === 'rolling5Day' && 'Trade based on 5-day average sentiment (smoothest signals)'}
              </p>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Avg Return per Trade</div>
                  <div className={`text-2xl font-bold ${data.returns[smoothingMethod].allStocks.avgReturnPerTrade >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {data.returns[smoothingMethod].allStocks.avgReturnPerTrade >= 0 ? '+' : ''}{data.returns[smoothingMethod].allStocks.avgReturnPerTrade.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Cumulative Return</div>
                  <div className={`text-xl font-bold ${data.returns[smoothingMethod].allStocks.cumulativeReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {data.returns[smoothingMethod].allStocks.cumulativeReturn >= 0 ? '+' : ''}{data.returns[smoothingMethod].allStocks.cumulativeReturn.toFixed(2)}%
                  </div>
                </div>
                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  {data.returns[smoothingMethod].allStocks.trades} trades
                </div>
              </div>
            </div>

            {/* High Accuracy Stocks Only */}
            <div className="bg-green-50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎯</span>
                <h3 className="font-semibold text-gray-900">High Accuracy Only</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">Same strategy but only trade stocks with {'>'}50% accuracy</p>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Avg Return per Trade</div>
                  <div className={`text-2xl font-bold ${data.returns[smoothingMethod].highAccuracy.avgReturnPerTrade >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {data.returns[smoothingMethod].highAccuracy.avgReturnPerTrade >= 0 ? '+' : ''}{data.returns[smoothingMethod].highAccuracy.avgReturnPerTrade.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Cumulative Return</div>
                  <div className={`text-xl font-bold ${data.returns[smoothingMethod].highAccuracy.cumulativeReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {data.returns[smoothingMethod].highAccuracy.cumulativeReturn >= 0 ? '+' : ''}{data.returns[smoothingMethod].highAccuracy.cumulativeReturn.toFixed(2)}%
                  </div>
                </div>
                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  {data.returns[smoothingMethod].highAccuracy.trades} trades ({data.returns[smoothingMethod].highAccuracy.stockCount} stocks)
                </div>
              </div>
            </div>

          </div>

          {/* Comparison Chart */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Strategy Comparison</h3>
            <div className="space-y-4">
              {[
                { label: 'All Stocks', return: data.returns[smoothingMethod].allStocks.cumulativeReturn },
                { label: 'High Accuracy Only', return: data.returns[smoothingMethod].highAccuracy.cumulativeReturn }
              ].map((strategy) => (
                <div key={strategy.label} className="flex items-center gap-4">
                  <div className="w-40 text-sm font-medium text-gray-700">{strategy.label}</div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-100 relative overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          strategy.return >= 0 ? 'bg-green-500' : 'bg-red-400'
                        }`}
                        style={{ 
                          width: `${Math.min(Math.abs(strategy.return), 100)}%`,
                          marginLeft: strategy.return < 0 ? 'auto' : '0'
                        }}
                      />
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400" />
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className={`text-lg font-bold ${strategy.return >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {strategy.return >= 0 ? '+' : ''}{strategy.return.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 bg-gray-400 mr-1 align-middle" /> 0% baseline
            </div>
          </div>

          {/* Best & Worst Trades Table - All Stocks */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-1">All Stocks Strategy - Top Trades</h3>
            <p className="text-xs text-gray-500 mb-4">Best and worst performing trades</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Type</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Stock</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Position</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Sentiment</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Entry</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Exit</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Price Δ</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Best Trades */}
                  {data.returns[smoothingMethod].allStocks.bestTrades.map((trade, i) => {
                    const entryDate = new Date(trade.date)
                    const exitDate = new Date(entryDate)
                    exitDate.setDate(exitDate.getDate() + 1)
                    
                    return (
                      <tr key={`best-all-${trade.date}-${trade.stockName}`} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            Best
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium">{trade.stockName}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-xs font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0.3 ? '📈 LONG' : '📉 SHORT'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0 ? '+' : ''}{trade.tradeSentiment.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(trade.date)}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.prevPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(exitDate.toISOString().split('T')[0])}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.nextPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`${trade.priceChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.priceChangePercent > 0 ? '+' : ''}{trade.priceChangePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="font-bold text-green-600">
                            +{trade.actualReturn.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  
                  {/* Worst Trades */}
                  {data.returns[smoothingMethod].allStocks.worstTrades.map((trade, i) => {
                    const entryDate = new Date(trade.date)
                    const exitDate = new Date(entryDate)
                    exitDate.setDate(exitDate.getDate() + 1)
                    
                    return (
                      <tr key={`worst-all-${trade.date}-${trade.stockName}`} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                            <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            Worst
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium">{trade.stockName}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-xs font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0.3 ? '📈 LONG' : '📉 SHORT'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0 ? '+' : ''}{trade.tradeSentiment.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(trade.date)}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.prevPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(exitDate.toISOString().split('T')[0])}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.nextPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`${trade.priceChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.priceChangePercent > 0 ? '+' : ''}{trade.priceChangePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="font-bold text-red-600">
                            {trade.actualReturn.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best & Worst Trades Table - High Accuracy */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-1">High Accuracy Strategy - Top Trades</h3>
            <p className="text-xs text-gray-500 mb-4">Best and worst performing trades from high-accuracy stocks only</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Type</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Stock</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Position</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Sentiment</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Entry</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Exit</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Price Δ</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Best Trades */}
                  {data.returns[smoothingMethod].highAccuracy.bestTrades.map((trade, i) => {
                    const entryDate = new Date(trade.date)
                    const exitDate = new Date(entryDate)
                    exitDate.setDate(exitDate.getDate() + 1)
                    
                    return (
                      <tr key={`best-ha-${trade.date}-${trade.stockName}`} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            Best
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium">{trade.stockName}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-xs font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0.3 ? '📈 LONG' : '📉 SHORT'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0 ? '+' : ''}{trade.tradeSentiment.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(trade.date)}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.prevPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(exitDate.toISOString().split('T')[0])}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.nextPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`${trade.priceChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.priceChangePercent > 0 ? '+' : ''}{trade.priceChangePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="font-bold text-green-600">
                            +{trade.actualReturn.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  
                  {/* Worst Trades */}
                  {data.returns[smoothingMethod].highAccuracy.worstTrades.map((trade, i) => {
                    const entryDate = new Date(trade.date)
                    const exitDate = new Date(entryDate)
                    exitDate.setDate(exitDate.getDate() + 1)
                    
                    return (
                      <tr key={`worst-ha-${trade.date}-${trade.stockName}`} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                            <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            Worst
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium">{trade.stockName}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-xs font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0.3 ? '📈 LONG' : '📉 SHORT'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`font-semibold ${trade.tradeSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.tradeSentiment > 0 ? '+' : ''}{trade.tradeSentiment.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(trade.date)}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.prevPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="text-xs text-gray-500">{formatDate(exitDate.toISOString().split('T')[0])}</div>
                          <div className="text-sm font-medium">{formatPrice(trade.nextPrice, trade.stockName)}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`${trade.priceChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.priceChangePercent > 0 ? '+' : ''}{trade.priceChangePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="font-bold text-red-600">
                            {trade.actualReturn.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-amber-50">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-sm mb-1">Disclaimer</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  These are <strong>hypothetical returns</strong> based on historical data. They assume perfect execution with no transaction costs, slippage, or liquidity constraints. 
                  This is NOT investment advice. Past performance does not guarantee future results. Real trading involves significant risk of loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stocks' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Performing Stocks */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <span className="text-green-500">🏆</span> Best Predicted Stocks
            </h3>
            <p className="text-xs text-gray-500 mb-4">Stocks where sentiment was most accurate</p>
            <div className="space-y-3">
              {topPerformingStocks.map((stock, i) => (
                <div key={stock.stockName} className="flex items-center gap-3 p-3 bg-green-50">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{stock.stockName}</div>
                    <div className="text-xs text-gray-500">
                      {stock.correctPredictions}/{stock.totalPredictions} correct
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{stock.accuracy.toFixed(0)}%</div>
                  </div>
                </div>
              ))}
              {topPerformingStocks.length === 0 && (
                <p className="text-gray-500 text-center py-4">Not enough data</p>
              )}
            </div>
          </div>

          {/* Worst Performing Stocks */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <span className="text-red-500">⚠️</span> Hardest to Predict
            </h3>
            <p className="text-xs text-gray-500 mb-4">Stocks where sentiment was least accurate</p>
            <div className="space-y-3">
              {worstPerformingStocks.map((stock, i) => (
                <div key={stock.stockName} className="flex items-center gap-3 p-3 bg-red-50">
                  <div className="w-6 h-6 rounded-full bg-red-400 text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{stock.stockName}</div>
                    <div className="text-xs text-gray-500">
                      {stock.correctPredictions}/{stock.totalPredictions} correct
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-500">{stock.accuracy.toFixed(0)}%</div>
                  </div>
                </div>
              ))}
              {worstPerformingStocks.length === 0 && (
                <p className="text-gray-500 text-center py-4">Not enough data</p>
              )}
            </div>
          </div>

          {/* All Stocks Performance */}
          <div className="md:col-span-2 bg-white p-6">
            <h3 className="text-lg font-semibold mb-1">All Stocks Performance</h3>
            <p className="text-xs text-gray-500 mb-4">Showing stocks with at least 5 predictions</p>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Stock</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Predictions</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Correct</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Accuracy</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Avg Sentiment</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">Avg Price Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.allStockPerformances.map((stock) => (
                    <tr key={stock.stockName} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{stock.stockName}</td>
                      <td className="py-2 px-3 text-center text-gray-600">{stock.totalPredictions}</td>
                      <td className="py-2 px-3 text-center text-gray-600">{stock.correctPredictions}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`font-semibold ${stock.accuracy >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                          {stock.accuracy.toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={stock.avgSentiment > 0 ? 'text-green-600' : stock.avgSentiment < 0 ? 'text-red-500' : 'text-gray-600'}>
                          {stock.avgSentiment > 0 ? '+' : ''}{stock.avgSentiment.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={stock.avgPriceChange > 0 ? 'text-green-600' : stock.avgPriceChange < 0 ? 'text-red-500' : 'text-gray-600'}>
                          {stock.avgPriceChange > 0 ? '+' : ''}{stock.avgPriceChange.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && portfolioData && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-2">Portfolio Simulation</h3>
            <p className="text-sm text-gray-500">
              Simulating a real portfolio with ₹50K available capital using our 3-day rolling average strategy on high-accuracy stocks, 
              with dynamic position sizing based on sentiment conviction. Trading weekdays only (markets closed on weekends).
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Max Capital Used</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{portfolioData.metrics.maxCapitalUsed.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {((portfolioData.metrics.maxCapitalUsed / portfolioData.metrics.startingCapital) * 100).toFixed(1)}% of ₹50K
              </div>
            </div>
            
            <div className="bg-white p-5 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">ROI on Capital</div>
              <div className={`text-2xl font-bold ${portfolioData.metrics.returnOnCapitalUsed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.metrics.returnOnCapitalUsed >= 0 ? '+' : ''}{portfolioData.metrics.returnOnCapitalUsed.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                on capital deployed
              </div>
            </div>
            
            <div className="bg-white p-5 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Total Profit</div>
              <div className={`text-2xl font-bold ${portfolioData.metrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.metrics.totalProfit >= 0 ? '+' : ''}₹{Math.abs(portfolioData.metrics.totalProfit).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {portfolioData.metrics.totalTrades} trades
              </div>
            </div>
            
            <div className="bg-white p-5 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Win Rate</div>
              <div className="text-2xl font-bold text-gray-900">
                {portfolioData.metrics.totalTrades > 0 
                  ? `${((portfolioData.metrics.winningTrades / portfolioData.metrics.totalTrades) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {portfolioData.metrics.winningTrades}W / {portfolioData.metrics.losingTrades}L
              </div>
            </div>
            
            <div className="bg-white p-5 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Stocks Used</div>
              <div className="text-2xl font-bold text-gray-900">
                {portfolioData.metrics.stocksUsed.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                high accuracy
              </div>
            </div>
          </div>

          {/* Trade Log Table */}
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Stock</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-600">Position</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-600">Shares</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-600">Entry</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-600">Exit</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-600">P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.tradeLog.slice().reverse().slice(0, 20).map((trade) => (
                    <tr key={trade.tradeId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">{trade.stock}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 ${
                          trade.position === 'LONG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {trade.position === 'LONG' ? '📈 LONG' : '📉 SHORT'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-gray-900">{trade.shares}×</td>
                      <td className="py-3 px-3 text-center">
                        <div className="text-xs text-gray-500">{formatDate(trade.entryDate)}</div>
                        <div className="text-sm">₹{trade.entryPrice.toFixed(2)}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="text-xs text-gray-500">{formatDate(trade.exitDate)}</div>
                        <div className="text-sm">₹{trade.exitPrice.toFixed(2)}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.profitLoss >= 0 ? '+' : ''}₹{Math.abs(trade.profitLoss).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Explanation */}
          <div className="bg-white p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">📊 Signal Generation</h4>
                <p className="text-gray-600 leading-relaxed">
                  3-day rolling average of sentiment scores smooths out noise and focuses on sustained trends.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">🎯 Stock Selection</h4>
                <p className="text-gray-600 leading-relaxed">
                  Only trade stocks with ≥50% historical accuracy and at least 5 predictions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">💰 Position Sizing</h4>
                <p className="text-gray-600 leading-relaxed">
                  Dynamic shares (1-5×) based on sentiment strength. Higher conviction = more shares.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-gray-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-sm mb-1">How we measure accuracy</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              A prediction is "correct" when positive sentiment (≥0.3) is followed by a price increase, 
              or negative sentiment (≤-0.3) is followed by a price decrease. Neutral sentiment 
              (between -0.3 and 0.3) is not counted as a prediction. This analysis compares each day's 
              sentiment with the next trading day's price change.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

