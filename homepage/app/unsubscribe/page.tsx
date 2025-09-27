'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
// Call internal API instead of importing server token client-side
import AnimatedBackground from '@/components/AnimatedBackground'
import Header from '@/components/Header'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const emailFromUrl = searchParams.get('email')
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setErrorMessage('Please enter your email address.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason })
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch (error) {
      console.error('Error unsubscribing:', error)
      setStatus('error')
      setErrorMessage('We couldn\'t find this email address in our system.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStatus('form')
    setErrorMessage('')
    setEmail('')
    setReason('')
  }

  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      <Header />
      
      <section className="relative z-10 min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg mx-auto w-full">
          
          {status === 'form' && (
            <div className="form-glass rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-unlink text-white text-2xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-dark mb-2">Unsubscribe</h2>
                <p className="text-gray-600">We're sorry to see you go! Please confirm your email below to unsubscribe from StocksBrew Daily.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl text-dark placeholder-gray-500 focus:ring-2 focus:ring-red-400 focus:border-transparent backdrop-blur-sm text-lg shadow-sm"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="relative">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">Reason for leaving (Optional)</label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl text-dark focus:ring-2 focus:ring-red-400 focus:border-transparent backdrop-blur-sm text-lg shadow-sm"
                  >
                    <option value="">Select a reason...</option>
                    <option value="too_frequent">Too frequent emails</option>
                    <option value="not_relevant">Content not relevant</option>
                    <option value="found_alternative">Found alternative source</option>
                    <option value="no_longer_investing">No longer investing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg">
                    {errorMessage}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Confirm Unsubscribe
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          )}
          
          {status === 'success' && (
            <div className="form-glass rounded-3xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Successfully Unsubscribed</h3>
              <p className="text-gray-600 mb-6">You have been successfully removed from our mailing list. You will no longer receive StocksBrew Daily newsletters.</p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Changed your mind? You can always <a href="/" className="text-accent hover:underline">subscribe again</a>.</p>
                <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-accent to-neon text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300">
                  Back to Home
                </a>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="form-glass rounded-3xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">Unsubscribe Failed</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="space-y-4">
                <button
                  onClick={resetForm}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-accent to-neon text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  )
} 