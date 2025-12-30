'use client'

import { useEffect, useState } from 'react'

interface Trade {
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
}

interface PortfolioData {
  tradeLog: Trade[]
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

export default function DemoPortfolioClient() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30)

  useEffect(() => {
    fetchPortfolioData()
  }, [timeRange])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/demo-portfolio?days=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch portfolio data')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900 mb-2">Loading Demo Portfolio...</div>
          <div className="text-sm text-gray-500">Simulating trades with real data</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-2">Error</div>
          <div className="text-sm text-gray-500">{error || 'Failed to load data'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Portfolio Demo</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simulating a real portfolio with ₹50K available capital using our 3-day rolling average strategy on high-accuracy stocks, with dynamic position sizing based on sentiment conviction. <strong>Trading weekdays only</strong> (markets closed on weekends).
          </p>
          
          {/* Time Range Selector */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 7
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange(30)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 30
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              1M
            </button>
            <button
              onClick={() => setTimeRange(90)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 90
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              3M
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Max Capital Used</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.metrics.maxCapitalUsed)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {((data.metrics.maxCapitalUsed / data.metrics.startingCapital) * 100).toFixed(1)}% of {formatCurrency(data.metrics.startingCapital)} available
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">ROI on Capital Used</div>
            <div className={`text-2xl font-bold ${data.metrics.returnOnCapitalUsed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.metrics.returnOnCapitalUsed >= 0 ? '+' : ''}{data.metrics.returnOnCapitalUsed.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              on {formatCurrency(data.metrics.maxCapitalUsed)} deployed
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Profit</div>
            <div className={`text-2xl font-bold ${data.metrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.metrics.totalProfit >= 0 ? '+' : ''}{formatCurrency(data.metrics.totalProfit)}
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-gray-900">
              {data.metrics.totalTrades > 0 
                ? `${((data.metrics.winningTrades / data.metrics.totalTrades) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.metrics.winningTrades}W / {data.metrics.losingTrades}L
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Trades</div>
            <div className="text-2xl font-bold text-gray-900">
              {data.metrics.totalTrades}
            </div>
          </div>
        </div>

        {/* Trade Log Table */}
        <div className="bg-white p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Trade History</h2>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Position</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Shares</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Sentiment</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Entry Date</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Entry Price</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Exit Date</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Exit Price</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {data.tradeLog.slice().reverse().map((trade) => (
                  <tr key={trade.tradeId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">#{trade.tradeId}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{trade.stock}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 ${
                        trade.position === 'LONG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trade.position === 'LONG' ? '📈 LONG' : '📉 SHORT'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-gray-900">{trade.shares}×</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-medium ${
                        trade.sentiment >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trade.sentiment >= 0 ? '+' : ''}{trade.sentiment.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{formatDate(trade.entryDate)}</td>
                    <td className="py-3 px-4 text-center font-medium">₹{trade.entryPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{formatDate(trade.exitDate)}</td>
                    <td className="py-3 px-4 text-center font-medium">₹{trade.exitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
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

                {/* Strategy Details */}
                <div className="bg-white p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">How Our Strategy Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">📊 Signal Generation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We calculate a <strong>3-day rolling average</strong> of sentiment scores from daily news analysis. 
                  This smooths out noise and focuses on sustained trends rather than single-day spikes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">🎯 Stock Selection</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Only trade stocks with <strong>≥50% historical accuracy</strong> and at least 5 predictions. 
                  This filters for stocks where sentiment has proven predictive of price movements.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">💰 Position Sizing (Dynamic)</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  <strong>Shares scale with conviction</strong> based on sentiment strength:
                </p>
                <ul className="text-xs text-gray-600 space-y-1 pl-4">
                  <li>• <strong>5 shares</strong> when sentiment ≥ 0.9 (very strong conviction)</li>
                  <li>• <strong>3 shares</strong> when sentiment ≥ 0.7 (strong conviction)</li>
                  <li>• <strong>2 shares</strong> when sentiment ≥ 0.5 (moderate conviction)</li>
                  <li>• <strong>1 share</strong> when sentiment ≥ 0.3 (low conviction)</li>
                </ul>
                <p className="text-gray-600 text-xs leading-relaxed mt-2">
                  We start with ₹50K available capital but only deploy what's needed for active positions.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">📈 Trading Logic</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong className="text-green-600">LONG</strong> when 3-day avg sentiment {'>'}0.3 (bullish news)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong className="text-red-600">SHORT</strong> when 3-day avg sentiment {'<'}-0.3 (bearish news)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600 font-bold">•</span>
                    <span><strong>HOLD</strong> when sentiment is neutral (-0.3 to +0.3)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">🔄 Exit Strategy</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Positions are closed daily and re-evaluated <strong>(weekdays only - no weekend trading)</strong>. 
                  If sentiment changes or signal disappears, we exit and book profit/loss. 
                  This keeps us aligned with current market sentiment.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">✅ Stocks in Portfolio</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {data.metrics.stocksUsed.length} stocks: {data.metrics.stocksUsed.slice(0, 3).join(', ')}
                  {data.metrics.stocksUsed.length > 3 && ` and ${data.metrics.stocksUsed.length - 3} more`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

