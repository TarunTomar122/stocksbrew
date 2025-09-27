'use client'

import React, { useState } from 'react'
import StockSearch from './StockSearch'
import ImageUpload from './ImageUpload'

export default function SubscriptionForm() {
  const [email, setEmail] = useState('')
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || selectedStocks.length === 0) {
      setMessage('Please enter your email and select at least one stock.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          selectedStocks,
          market: 'indian'
        }),
      })

      if (response.ok) {
        setMessage('Successfully subscribed! You\'ll receive your first newsletter tomorrow at 8 AM.')
        setEmail('')
        setSelectedStocks([])
      } else {
        setMessage('Subscription failed. Please try again.')
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 py-8 md:p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-black mb-2">Subscribe</h3>
        <p className="text-gray-600">Get personalized AI newsletters for your stock portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          />
        </div>

        {/* Stock Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select stocks for your newsletter
          </label>
          <StockSearch 
            selectedStocks={selectedStocks}
            onStockSelect={(symbol: string) => {
              if (!selectedStocks.includes(symbol)) {
                setSelectedStocks([...selectedStocks, symbol])
              }
            }}
            onStockRemove={(symbol: string) => {
              setSelectedStocks(selectedStocks.filter(s => s !== symbol))
            }}
          />
        </div>
        <p className="text-sm text-gray-500"> or </p>
        {/* Image Upload */}
        <div>
          <ImageUpload 
            onStocksExtracted={(stocks) => {
              const newStocks = Array.from(new Set([...selectedStocks, ...stocks]))
              setSelectedStocks(newStocks)
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Subscribe'}
        </button>

        {/* Message */}
        {message && (
          <div className={`text-center text-sm ${message.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
} 