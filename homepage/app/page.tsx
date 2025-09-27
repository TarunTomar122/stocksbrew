'use client'

import React from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import Header from '@/components/Header'
import SubscriptionForm from '@/components/SubscriptionForm'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      <Header />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 px-4">
        <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
              Personalized<br />
              Stocks Newsletter
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get daily newsletter with the latest market news of your favorite stocks, summarized in a quick byte sized format.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors"
                onClick={() => {
                  const subscriptionSection = document.getElementById('subscription')
                  if (subscriptionSection) {
                    subscriptionSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                Subscribe →
              </button>
              <a href="/explore" className="text-black border border-gray-300 px-8 py-4 font-medium hover:bg-gray-50 transition-colors">
                See Examples
              </a>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 mb-8">StocksBrew collects and summarizes news from leading financial news sources.</p>
            <div className="flex justify-center items-center gap-8 opacity-40 flex-wrap">
              <span className="text-lg font-medium">Mint</span>
              <span className="text-lg font-medium">Bloomberg</span>
              <span className="text-lg font-medium">CNBC</span>
              <span className="text-lg font-medium">Financial Times</span>
              <span className="text-lg font-medium">Reuters</span>
              <span className="text-lg font-medium">The Economic Times</span>
            </div>
          </div>

        <div className="flex flex-col gap-4 mb-12 mt-32 text-center">
          <p className="text-xl max-w-2xl mx-auto leading-relaxed"> I made stocksbrew free for everybody and so if you want to support me, you can {''} 
          <a href="https://buymeacoffee.com/taratdev" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 underline text-green-500">buy me a coffee ☕</a></p>
        </div>

        </div>
      </section>

      {/* Product Section */}
      <section className="relative z-10 py-20 md:px-4 bg-gray-50" id="subscription">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white rounded-2xl py-12 md:p-12 shadow-sm">
            <SubscriptionForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-brain text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                We verify the news from leading financial news sources<br />
                and summarize them for you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Daily Automation</h3>
              <p className="text-gray-600">
                Automated newsletter generation and delivery<br />
                every morning at 8 AM sharp.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-user-check text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Personalization</h3>
              <p className="text-gray-600">
                Tailored insights based on your selected<br />
                stocks and investment preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer links */}
      <section className="relative z-10 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-40">
            <a href="https://www.linkedin.com/in/tarun-tomar-4ab0b5193/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">LinkedIn</a>
            <a href="https://github.com/TarunTomar122" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">GitHub</a>
            <a href="https://www.instagram.com/tarat.hobbies/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Instagram</a>
            <a href="https://buymeacoffee.com/taratdev" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Buy me a coffee ☕</a>
          </div>
        </div>
      </section>
    </main>
  )
} 