'use client'

import React, { useState, useEffect } from 'react'

interface SentimentDataPoint {
  date: string
  sentiment_score: number
  sentiment: string
  stock_price?: number
  stock_symbol?: string
}

interface SentimentChartProps {
  stockName: string
  days?: number
}

type ChartMode = 'sentiment' | 'both' | 'price'

export default function SentimentChart({ stockName, days = 30 }: SentimentChartProps) {
  const [data, setData] = useState<SentimentDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<number>(days)
  const [chartMode, setChartMode] = useState<ChartMode>('sentiment')
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  
  // Detect if it's an Indian stock (for currency display)
  const isIndianStock = data.length > 0 && data[0].stock_symbol && 
    (data[0].stock_symbol.endsWith('.NS') || data[0].stock_symbol.endsWith('.BO'))
  const currencySymbol = isIndianStock ? '₹' : '$'

  useEffect(() => {
    fetchSentimentData()
  }, [stockName, timeRange])

  const fetchSentimentData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/stock-data?stock=${encodeURIComponent(stockName)}&days=${timeRange}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment data')
      }
      
      const result = await response.json()
      setData(result.sentimentData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-500">Loading sentiment data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-500">No sentiment data available for this period</div>
      </div>
    )
  }

  // Chart dimensions
  const width = 1000
  const height = 400
  const padding = { top: 30, right: 80, bottom: 60, left: 70 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Detect if we have sentiment-based prediction (sentiment exists but no price yet for latest data)
  const lastDataPoint = data[data.length - 1]
  let hasPrediction = false
  let predictedPrice: number | null = null
  let lastKnownPriceIndex = -1
  
  // Only predict if we have at least one historical price
  if (lastDataPoint && 
      lastDataPoint.sentiment_score !== undefined && 
      !lastDataPoint.stock_price) {
    
    // Find last known price
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].stock_price !== undefined && data[i].stock_price !== null) {
        predictedPrice = data[i].stock_price!
        lastKnownPriceIndex = i
        break
      }
    }
    
    if (predictedPrice !== null) {
      hasPrediction = true
      // Apply sentiment impact: each 0.1 sentiment = ~1% price change
      // Sentiment of +1.0 = +5% predicted, -1.0 = -5% predicted
      const sentimentImpact = lastDataPoint.sentiment_score * 0.05
      predictedPrice = predictedPrice * (1 + sentimentImpact)
    }
  }

  // Get price min/max for scaling (include prediction)
  const priceValues = data.map(d => d.stock_price).filter((p): p is number => p !== undefined && p !== null)
  if (predictedPrice !== null && hasPrediction) {
    priceValues.push(predictedPrice)
  }
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0
  const priceRange = maxPrice - minPrice
  const pricePadding = priceRange * 0.1
  
  // Check if we have price data
  const hasPriceData = priceValues.length > 0

  // Scale functions
  const xScale = (index: number) => {
    if (data.length === 1) {
      return padding.left + chartWidth / 2 // Center single point
    }
    return padding.left + (index / (data.length - 1)) * chartWidth
  }

  const yScale = (value: number) => {
    // Add some padding to prevent clipping at edges
    const minValue = -1.1
    const maxValue = 1.1
    const normalized = (value - minValue) / (maxValue - minValue)
    return padding.top + chartHeight - (normalized * chartHeight)
  }

  // Price scale function (right axis)
  const yPriceScale = (value: number) => {
    if (priceRange === 0) return padding.top + chartHeight / 2
    const normalized = (value - (minPrice - pricePadding)) / (priceRange + 2 * pricePadding)
    return padding.top + chartHeight - (normalized * chartHeight)
  }

  // Generate sentiment line path
  const linePath = data.map((point, index) => {
    const x = xScale(index)
    const y = yScale(point.sentiment_score)
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')

  // Generate price line path
  const priceLinePath = data
    .map((point, index) => {
      if (point.stock_price === undefined || point.stock_price === null) return null
      const x = xScale(index)
      const y = yPriceScale(point.stock_price)
      return { x, y, index }
    })
    .filter((p): p is { x: number; y: number; index: number } => p !== null)
    .map((point, idx) => {
      return idx === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    })
    .join(' ')

  // Generate area path
  const areaPath = linePath + 
    ` L ${xScale(data.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center justify-between">
        {/* Time range selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 7 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 30 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1M
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 90 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3M
          </button>
          <button
            onClick={() => setTimeRange(365)}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 365 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1Y
          </button>
        </div>

        {/* Chart mode selector */}
        {hasPriceData && (
          <div className="flex gap-2">
            <button
              onClick={() => setChartMode('sentiment')}
              className={`px-3 py-1 rounded text-sm ${
                chartMode === 'sentiment' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sentiment
            </button>
            <button
              onClick={() => setChartMode('both')}
              className={`px-3 py-1 rounded text-sm ${
                chartMode === 'both' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setChartMode('price')}
              className={`px-3 py-1 rounded text-sm ${
                chartMode === 'price' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Price
            </button>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4">
        <div className="overflow-x-auto lg:overflow-x-visible">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[800px] lg:min-w-0 h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
          {/* Market closed indicators (gray bars for days when price didn't change) */}
          {(chartMode === 'both' || chartMode === 'price') && (() => {
            const closedPeriods: { start: number; end: number }[] = []
            let currentPeriodStart: number | null = null
            
            // Identify consecutive days where market was closed
            data.forEach((point, index) => {
              if (index === 0) return
              
              const currentPrice = point.stock_price
              const prevPrice = data[index - 1].stock_price
              
              if (!currentPrice || !prevPrice) return
              
              const priceUnchanged = Math.abs(currentPrice - prevPrice) < 0.01
              
              if (priceUnchanged) {
                if (currentPeriodStart === null) {
                  currentPeriodStart = index - 1
                }
              } else {
                if (currentPeriodStart !== null) {
                  closedPeriods.push({ start: currentPeriodStart, end: index - 1 })
                  currentPeriodStart = null
                }
              }
            })
            
            // Handle last period if it extends to the end
            if (currentPeriodStart !== null) {
              closedPeriods.push({ start: currentPeriodStart, end: data.length - 1 })
            }
            
            // Render the bars
            return closedPeriods.map((period, idx) => {
              const startX = xScale(period.start)
              const endX = xScale(period.end)
              const barWidth = endX - startX
              
              return (
                <g key={`market-closed-${idx}`}>
                  <rect
                    x={startX}
                    y={padding.top}
                    width={barWidth}
                    height={chartHeight}
                    fill="#f9fafb"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    opacity="0.7"
                    pointerEvents="none"
                  />
                  {barWidth > 50 && (
                    <text
                      x={startX + barWidth / 2}
                      y={padding.top + 15}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      Market Closed
                    </text>
                  )}
                </g>
              )
            })
          })()}

          {/* Sentiment Grid lines and axis (show when sentiment or both) */}
          {(chartMode === 'sentiment' || chartMode === 'both') && (
            <>
              {[-1, -0.5, 0, 0.5, 1].map((value) => (
                <g key={value}>
                  {/* Only show grid lines for major values in 'both' mode */}
                  {(chartMode === 'sentiment' || value === 0 || Math.abs(value) === 1) && (
                    <line
                      x1={padding.left}
                      y1={yScale(value)}
                      x2={width - padding.right}
                      y2={yScale(value)}
                      stroke={value === 0 ? '#d1d5db' : '#f3f4f6'}
                      strokeWidth={value === 0 ? '1.5' : '1'}
                      strokeDasharray={value === 0 ? '5,5' : '0'}
                      opacity={chartMode === 'both' ? '0.5' : '1'}
                    />
                  )}
                  <text
                    x={padding.left - 10}
                    y={yScale(value)}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fontSize="11"
                    fill={chartMode === 'both' ? '#3b82f6' : '#6b7280'}
                    fontWeight={chartMode === 'both' ? '600' : '400'}
                  >
                    {value.toFixed(1)}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* Price Grid lines and axis (show when price or both) */}
          {(chartMode === 'price' || chartMode === 'both') && priceValues.length > 0 && (
            <>
              {[0, 0.5, 1].map((ratio) => {
                const value = (minPrice - pricePadding) + ratio * (priceRange + 2 * pricePadding)
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={yPriceScale(value)}
                      x2={width - padding.right}
                      y2={yPriceScale(value)}
                      stroke={chartMode === 'both' ? '#fef3c7' : '#e5e7eb'}
                      strokeWidth="1"
                      strokeDasharray={chartMode === 'both' ? '3,3' : '0'}
                    />
                    <text
                      x={width - padding.right + 10}
                      y={yPriceScale(value)}
                      textAnchor="start"
                      alignmentBaseline="middle"
                      fontSize="11"
                      fill={chartMode === 'both' ? '#f59e0b' : '#6b7280'}
                      fontWeight={chartMode === 'both' ? '600' : '400'}
                    >
                      {currencySymbol}{value.toFixed(2)}
                    </text>
                  </g>
                )
              })}
            </>
          )}

          {/* Sentiment Area fill */}
          {(chartMode === 'sentiment' || chartMode === 'both') && (
            <path
              d={areaPath}
              fill="url(#sentimentGradient)"
              opacity={chartMode === 'both' ? '0.08' : '0.15'}
            />
          )}

          {/* Sentiment Line */}
          {(chartMode === 'sentiment' || chartMode === 'both') && (
            <path
              d={linePath}
              fill="none"
              stroke={chartMode === 'both' ? '#3b82f6' : '#000000'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Price Line - render after sentiment so it's on top */}
          {(chartMode === 'price' || chartMode === 'both') && priceLinePath && (
            <path
              d={priceLinePath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={chartMode === 'both' ? '1' : '1'}
            />
          )}

          {/* Predicted Price Line (dotted) - when we have sentiment but no price yet */}
          {(chartMode === 'price' || chartMode === 'both') && hasPrediction && predictedPrice !== null && lastKnownPriceIndex >= 0 && (
            <>
              {/* Dotted prediction line */}
              <line
                x1={xScale(lastKnownPriceIndex)}
                y1={yPriceScale(data[lastKnownPriceIndex].stock_price!)}
                x2={xScale(data.length - 1)}
                y2={yPriceScale(predictedPrice)}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="8,4"
                strokeLinecap="round"
                opacity="0.6"
                pointerEvents="none"
              />
              
              {/* Prediction point */}
              <circle
                cx={xScale(data.length - 1)}
                cy={yPriceScale(predictedPrice)}
                r="6"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="3,2"
                opacity="0.8"
                pointerEvents="none"
              />
              
              {/* Prediction label */}
              <g>
                <rect
                  x={xScale(data.length - 1) - 45}
                  y={yPriceScale(predictedPrice) - 28}
                  width="90"
                  height="22"
                  fill="rgba(245, 158, 11, 0.95)"
                  rx="4"
                  pointerEvents="none"
                />
                <text
                  x={xScale(data.length - 1)}
                  y={yPriceScale(predictedPrice) - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="700"
                  pointerEvents="none"
                >
                  PREDICTED
                </text>
              </g>
            </>
          )}

          {/* Hover areas for better interaction */}
          {data.map((point, index) => {
            const x = xScale(index)
            return (
              <rect
                key={`hover-${index}`}
                x={x - 15}
                y={padding.top}
                width="30"
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              />
            )
          })}

          {/* Vertical crosshair line on hover */}
          {hoveredPoint !== null && (
            <line
              x1={xScale(hoveredPoint)}
              y1={padding.top}
              x2={xScale(hoveredPoint)}
              y2={height - padding.bottom}
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              pointerEvents="none"
            />
          )}

          {/* Sentiment Data points */}
          {(chartMode === 'sentiment' || chartMode === 'both') && data.map((point, index) => {
            const x = xScale(index)
            const y = yScale(point.sentiment_score)
            const color = chartMode === 'both' ? '#3b82f6' : 
                         (point.sentiment_score > 0 ? '#10b981' : point.sentiment_score < 0 ? '#ef4444' : '#6b7280')
            const isHovered = hoveredPoint === index
            
            return (
              <circle
                key={`sentiment-${index}`}
                cx={x}
                cy={y}
                r={isHovered ? "7" : "5"}
                fill={color}
                stroke="white"
                strokeWidth={isHovered ? "3" : "2.5"}
                style={{ transition: 'all 0.15s ease' }}
                pointerEvents="none"
              />
            )
          })}

          {/* Price Data points */}
          {(chartMode === 'price' || chartMode === 'both') && data.map((point, index) => {
            if (point.stock_price === undefined || point.stock_price === null) return null
            const x = xScale(index)
            const y = yPriceScale(point.stock_price)
            const isHovered = hoveredPoint === index
            
            return (
              <circle
                key={`price-${index}`}
                cx={x}
                cy={y}
                r={isHovered ? "7" : "5"}
                fill="#f59e0b"
                stroke="white"
                strokeWidth={isHovered ? "3" : "2.5"}
                style={{ transition: 'all 0.15s ease' }}
                pointerEvents="none"
              />
            )
          })}

          {/* Tooltip on hover */}
          {hoveredPoint !== null && (
            <g pointerEvents="none">
              <foreignObject
                x={xScale(hoveredPoint) > width / 2 ? xScale(hoveredPoint) - 170 : xScale(hoveredPoint) + 10}
                y={padding.top + 10}
                width="160"
                height="100"
              >
                <div className="bg-gray-900 text-white rounded-lg p-3 shadow-xl border border-gray-700">
                  <div className="text-xs font-semibold text-gray-300 mb-2">
                    {formatDate(data[hoveredPoint].date)}
                  </div>
                  {(chartMode === 'sentiment' || chartMode === 'both') && (
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-blue-300">Sentiment:</span>
                      <span className="text-sm font-bold text-blue-400">
                        {data[hoveredPoint].sentiment_score.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {(chartMode === 'price' || chartMode === 'both') && data[hoveredPoint].stock_price && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-300">Price:</span>
                      <span className="text-sm font-bold text-amber-400">
                        {currencySymbol}{data[hoveredPoint].stock_price?.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </foreignObject>
            </g>
          )}

          {/* X-axis labels */}
          {data.map((point, index) => {
            // Show label for every nth point depending on data length
            const step = data.length <= 7 ? 1 : Math.max(1, Math.ceil(data.length / 6))
            const shouldShowLabel = data.length === 1 || index % step === 0 || index === data.length - 1
            
            if (shouldShowLabel) {
              return (
                <text
                  key={index}
                  x={xScale(index)}
                  y={height - padding.bottom + 25}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                  fontWeight="500"
                >
                  {formatDate(point.date)}
                </text>
              )
            }
            return null
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="sentimentGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Y-axis labels */}
          {(chartMode === 'sentiment' || chartMode === 'both') && (
            <text
              x={padding.left - 45}
              y={height / 2}
              textAnchor="middle"
              fontSize="12"
              fill={chartMode === 'both' ? '#3b82f6' : '#374151'}
              fontWeight={chartMode === 'both' ? '600' : '400'}
              transform={`rotate(-90, ${padding.left - 45}, ${height / 2})`}
            >
              Sentiment Score
            </text>
          )}

          {/* {(chartMode === 'price' || chartMode === 'both') && priceValues.length > 0 && (
            <text
              x={width - padding.right + 45}
              y={height / 2}
              textAnchor="middle"
              fontSize="12"
              fill={chartMode === 'both' ? '#f59e0b' : '#374151'}
              fontWeight={chartMode === 'both' ? '600' : '400'}
              transform={`rotate(90, ${width - padding.right + 45}, ${height / 2})`}
            >
              Stock Price ({currencySymbol})
            </text>
          )} */}

          {/* X-axis label */}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
          >
            Date
          </text>
        </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm flex-wrap">
          {chartMode === 'sentiment' && (
            <>
              <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-50 rounded-full">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-700 font-medium">Positive</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-50 rounded-full">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-500"></div>
                <span className="text-gray-700 font-medium">Neutral</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-50 rounded-full">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-700 font-medium">Negative</span>
              </div>
            </>
          )}
          {chartMode === 'both' && (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-2 bg-blue-50 rounded-full border border-blue-200">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                <span className="text-blue-700 font-semibold text-xs sm:text-sm">Sentiment</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-2 bg-amber-50 rounded-full border border-amber-200">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500"></div>
                <span className="text-amber-700 font-semibold text-xs sm:text-sm">Price ({currencySymbol})</span>
              </div>
            </>
          )}
          {chartMode === 'price' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-2 bg-amber-50 rounded-full border border-amber-200">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500"></div>
                <span className="text-amber-700 font-semibold text-xs sm:text-sm">Stock Price ({currencySymbol})</span>
              </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Average</div>
            <div className="text-lg font-semibold">
              {(data.reduce((sum, d) => sum + d.sentiment_score, 0) / data.length).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Highest</div>
            <div className="text-lg font-semibold text-green-600">
              {Math.max(...data.map(d => d.sentiment_score)).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Lowest</div>
            <div className="text-lg font-semibold text-red-600">
              {Math.min(...data.map(d => d.sentiment_score)).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

