'use client'

import React, { useState } from 'react'

interface Summary {
  tldr: string
  sentiment: 'positive' | 'negative' | 'neutral'
  key_points: (string | any)[]
  action_items: (string | any)[]
}

interface DaySummaries {
  date: string
  summaries: Record<string, Summary>
}

interface ExploreClientProps {
  summaries: DaySummaries[]
}

export default function ExploreClient({ summaries }: ExploreClientProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (summaries.length === 0) return ''
    // Find first date with data
    const firstWithData = summaries.find(s => Object.keys(s.summaries).length > 0)
    return firstWithData ? firstWithData.date : summaries[0].date
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTimelineDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      date: date.getDate()
    }
  }

  const parseMarkdownBold = (text: string) => {
    if (typeof text !== 'string') return text
    // Split text by **text** pattern and render bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** and make bold
        const boldText = part.slice(2, -2)
        return <strong key={index}>{boldText}</strong>
      }
      return part
    })
  }

  const renderContent = (content: string | any) => {
    if (typeof content === 'string') {
      return parseMarkdownBold(content)
    }
    if (typeof content === 'object' && content !== null) {
      // Handle known object structures
      if (content.title && content.summary) {
        return (
          <span>
            <strong>{content.title}</strong>: {parseMarkdownBold(content.summary)}
          </span>
        )
      }
      if (content.point && content.details) {
        return (
          <span>
            {parseMarkdownBold(content.point)} {parseMarkdownBold(content.details)}
          </span>
        )
      }
      // Fallback: try to render values
      return Object.values(content).map((val: any, i) => (
        <span key={i}>{typeof val === 'string' ? parseMarkdownBold(val) : JSON.stringify(val)} </span>
      ))
    }
    return String(content)
  }

  const filterRelevantStocks = (summaries: Record<string, Summary>) => {
    return Object.entries(summaries).filter(([company, summary]) => {
      // Filter out HOT STOCK
      if (company === 'HOT STOCK') return false
      
      // Filter out stocks with no material news
      const hasNoMaterialNews = summary.tldr.toLowerCase().includes('no material news') ||
                               summary.tldr.toLowerCase().includes('no news affecting') ||
                               summary.tldr.toLowerCase().includes('no significant news')
      
      return !hasNoMaterialNews
    })
  }

  const selectedSummaries = summaries.find(s => s.date === selectedDate)
  const relevantStocks = selectedSummaries ? filterRelevantStocks(selectedSummaries.summaries) : []

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Daily Market Insights
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered analysis of stock market developments
          </p>
        </div>

        {/* Timeline Date Selector */}
        {summaries.length > 0 && (
          <div className="mb-16">
            <div className="border border-gray-200 p-4 sm:p-6 bg-white shadow-sm overflow-x-auto scrollbar-hide">
              {/* Timeline Points */}
              <div className="flex gap-4 sm:gap-6 md:gap-8 lg:justify-between min-w-max pb-2">
                {summaries.slice().reverse().map((summary, index) => {
                  const timelineDate = formatTimelineDate(summary.date)
                  const isSelected = selectedDate === summary.date
                  const relevantCount = filterRelevantStocks(summary.summaries).length
                  
                  return (
                    <div key={summary.date} className="flex flex-col items-center relative flex-shrink-0">
                      {/* Timeline Point */}
                      <button
                        onClick={() => setSelectedDate(summary.date)}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-black border-black' 
                            : 'bg-white border-gray-300 hover:border-gray-500'
                        }`}
                      />
                      
                      {/* Date Info */}
                      <div className="mt-3 sm:mt-4 text-center cursor-pointer" onClick={() => setSelectedDate(summary.date)}>
                        <div className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                          {timelineDate.day}
                        </div>
                        <div className={`text-base sm:text-lg font-bold ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                          {timelineDate.date}
                        </div>
                        <div className={`text-xs sm:text-sm ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                          {timelineDate.month}
                        </div>
                        
                        {/* Stock Count Indicator */}
                        {relevantCount > 0 && (
                          <div className={`mt-1 sm:mt-2 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                            isSelected 
                              ? 'bg-black text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {relevantCount} stock{relevantCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        {selectedSummaries && relevantStocks.length > 0 && (
          <article className="prose prose-lg max-w-none">
            {/* Article Header */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-black mb-2">
                Market Analysis for {formatDate(selectedSummaries.date)}
              </h2>
              <p className="text-gray-600">
                {relevantStocks.length} stocks with significant developments
              </p>
            </div>

            {/* Article Body */}
            <div className="space-y-8">
              {relevantStocks.map(([company, summary], index) => (
                <section key={company} className="border-l-4 border-gray-200 pl-6">
                  <h3 className="text-2xl font-bold text-black mb-3 flex items-center gap-3">
                    {company}
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      summary.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      summary.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
                    </span>
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                    {parseMarkdownBold(summary.tldr)}
                  </p>

                  {/* Key Points */}
                  {summary.key_points && summary.key_points.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-xl mb-2">Key Developments:</h4>
                      <ul className="space-y-2">
                        {summary.key_points.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-gray-700 leading-relaxed">
                            {renderContent(point)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Items */}
                  {summary.action_items && summary.action_items.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 text-xl mb-2">What to Watch:</h4>
                      <ul className="space-y-2">
                        {summary.action_items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700 leading-relaxed">
                            {renderContent(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Separator */}
                  {index < relevantStocks.length - 1 && (
                    <div className="border-b border-gray-100 mt-6"></div>
                  )}
                </section>
              ))}
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Analysis generated by StocksBrew AI • {formatDate(selectedSummaries.date)}
              </p>
            </div>
          </article>
        )}

        {/* No Relevant Data State */}
        {selectedSummaries && relevantStocks.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Significant Market News</h3>
            <p className="text-gray-600">
              No stocks had material news affecting their prices on {formatDate(selectedSummaries.date)}.
            </p>
          </div>
        )}

        {/* No Data State */}
        {summaries.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Analysis Available</h3>
            <p className="text-gray-600">
              Market analysis will appear here once generated.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 