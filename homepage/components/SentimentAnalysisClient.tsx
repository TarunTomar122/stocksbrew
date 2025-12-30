'use client'

import React, { useState, useMemo } from 'react'
import SentimentChart from './SentimentChart'

interface Summary {
  tldr: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentiment_score?: number
  key_points: (string | any)[]
  action_items: (string | any)[]
}

interface DaySummaries {
  date: string
  summaries: Record<string, Summary>
}

interface SentimentAnalysisClientProps {
  summaries: DaySummaries[]
}

export default function SentimentAnalysisClient({ summaries }: SentimentAnalysisClientProps) {
  const [selectedStock, setSelectedStock] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get all unique stocks from all summaries
  const allStocks = useMemo(() => {
    const stockSet = new Set<string>()
    summaries.forEach(daySummary => {
      Object.keys(daySummary.summaries).forEach(stock => {
        if (stock !== 'HOT STOCK') {
          stockSet.add(stock)
        }
      })
    })
    return Array.from(stockSet).sort()
  }, [summaries])

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return allStocks
    return allStocks.filter(stock => 
      stock.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [allStocks, searchQuery])

  // Get sentiment statistics for selected stock
  const stockStats = useMemo(() => {
    if (!selectedStock) return null

    const scores: number[] = []
    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0

    summaries.forEach(daySummary => {
      const summary = daySummary.summaries[selectedStock]
      if (summary && summary.sentiment_score !== undefined) {
        scores.push(summary.sentiment_score)
        if (summary.sentiment === 'positive') positiveCount++
        else if (summary.sentiment === 'negative') negativeCount++
        else neutralCount++
      }
    })

    if (scores.length === 0) return null

    return {
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      totalDays: scores.length,
      positiveCount,
      negativeCount,
      neutralCount
    }
  }, [selectedStock, summaries])

  return (
    <div className="h-screen flex flex-col bg-gray-50 max-w-6xl m-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-black">Explore Stocks</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Track sentiment trends across {allStocks.length} stocks
            </p>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content: Sidebar + Chart Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar - Stock List */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-50
          w-80 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          mt-0 md:mt-0
          pb-4
        `}>
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-2">
              {filteredStocks.length} {filteredStocks.length === 1 ? 'stock' : 'stocks'} available
            </p>
          </div>

          {/* Stock List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredStocks.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredStocks.map((stock) => {
                  const isSelected = selectedStock === stock
                  return (
                    <button
                      key={stock}
                      onClick={() => {
                        setSelectedStock(stock)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">{stock}</div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No stocks found
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chart Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          {selectedStock ? (
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Stock Header */}
              {/* <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-black mb-2">{selectedStock}</h2>
                {stockStats && (
                  <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Data Points:</span>
                      <span className="font-semibold text-gray-900">{stockStats.totalDays}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-gray-600">{stockStats.positiveCount} Positive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="text-gray-600">{stockStats.neutralCount} Neutral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-gray-600">{stockStats.negativeCount} Negative</span>
                    </div>
                  </div>
                )}
              </div> */}

              {/* Statistics Grid */}
              {/* {stockStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Average</div>
                    <div className={`text-xl md:text-2xl font-bold ${
                      stockStats.average > 0 ? 'text-green-600' : 
                      stockStats.average < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {stockStats.average > 0 ? '+' : ''}{stockStats.average.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Highest</div>
                    <div className="text-xl md:text-2xl font-bold text-green-600">
                      {stockStats.highest > 0 ? '+' : ''}{stockStats.highest.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Lowest</div>
                    <div className="text-xl md:text-2xl font-bold text-red-600">
                      {stockStats.lowest.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Range</div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {(stockStats.highest - stockStats.lowest).toFixed(2)}
                    </div>
                  </div>
                </div>
              )} */}

              {/* Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold mb-4">Sentiment Trend</h3>
                <SentimentChart stockName={selectedStock} days={30} />
              </div>

              {/* Recent Summaries */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold mb-4">Recent News Sentiment</h3>
                <div className="space-y-4">
                  {summaries.slice(0, 7).map((daySummary) => {
                    const summary = daySummary.summaries[selectedStock]
                    if (!summary) return null

                    return (
                      <div key={daySummary.date} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {new Date(daySummary.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              summary.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                              summary.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
                            </span>
                            {summary.sentiment_score !== undefined && (
                              <span className={`text-xs font-mono font-semibold ${
                                summary.sentiment_score > 0 ? 'text-green-600' :
                                summary.sentiment_score < 0 ? 'text-red-600' :
                                'text-gray-600'
                              }`}>
                                {summary.sentiment_score > 0 ? '+' : ''}{summary.sentiment_score.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{summary.tldr}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-5xl md:text-6xl mb-4">📊</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Select a Stock</h3>
                <p className="text-sm md:text-base text-gray-600">
                  {isMobileMenuOpen ? 'Choose from the menu' : 'Tap the menu icon to choose a stock'}
                  <span className="hidden md:inline"> from the sidebar to view its sentiment analysis</span>
                </p>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden mt-4 px-4 py-2 bg-black text-white rounded-lg"
                >
                  Browse Stocks
                </button>
              </div>
            </div>
          )}

          {/* No Data State */}
          {allStocks.length === 0 && (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-5xl md:text-6xl mb-4">📭</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
                <p className="text-sm md:text-base text-gray-600">
                  Sentiment analysis data will appear once summaries are generated
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

