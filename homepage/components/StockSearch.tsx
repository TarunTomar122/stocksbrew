'use client'

import React, { useState, useEffect, useRef } from 'react'
import { searchStocks, Stock } from '@/lib/stocks'

interface StockSearchProps {
  selectedStocks: string[]
  onStockSelect: (symbol: string) => void
  onStockRemove: (symbol: string) => void
}

export default function StockSearch({ selectedStocks, onStockSelect, onStockRemove }: StockSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchStocks(searchQuery)
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStockSelect = (stock: Stock) => {
    if (!selectedStocks.includes(stock.symbol)) {
      onStockSelect(stock.symbol)
    }
    setSearchQuery('')
    setShowResults(false)
  }

  const handleStockRemove = (symbol: string) => {
    onStockRemove(symbol)
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Stocks</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          placeholder="Search a stock (e.g., Apple, Tesla, Tata Motors)"
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white transition-all text-lg"
        />
        <i className="fas fa-search absolute right-4 text-gray-500 top-12 opacity-0 md:opacity-100"></i>
        
        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl max-h-60 overflow-y-auto z-50 shadow-lg">
            {searchResults.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleStockSelect(stock)}
                className={`p-3 sm:p-4 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-accent/10 transition-colors ${
                  selectedStocks.includes(stock.symbol) ? 'bg-accent/20' : ''
                }`}
              >
                <div className="flex text-left justify-between items-center">
                  <div>
                    <div className="font-semibold text-dark text-sm sm:text-base">
                      {stock.symbol}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm truncate">
                      {stock.name}
                    </div>
                  </div>
                  {selectedStocks.includes(stock.symbol) && (
                    <i className="fas fa-check text-accent"></i>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Stocks Display */}
      {selectedStocks.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-3">Selected Stocks:</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedStocks.map((symbol) => (
              <div
                key={symbol}
                className="inline-flex items-center px-4 py-2 bg-blue/10 border border-blue/20 rounded-lg text-sm text-blue font-medium"
              >
                <span className="mr-2">{symbol}</span>
                <button
                  onClick={() => handleStockRemove(symbol)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{selectedStocks.length}</span> stocks selected 
            <span className="text-accent font-medium"> (minimum 3 required)</span>
          </div>
        </div>
      )}
    </div>
  )
} 