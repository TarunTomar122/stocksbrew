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
            <div className="inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm mb-6">
              🔬 AI Experiment
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
              Can AI Sentiment<br />
              Predict Stock Prices?
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              A stateful AI system that analyzes news sentiment and tracks how well it predicts price movements. Get daily insights delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/performance" className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors">
                View Performance →
              </a>
              <a href="/sentiment" className="text-black border border-gray-300 px-8 py-4 font-medium hover:bg-gray-50 transition-colors">
                Explore Data
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">50+</div>
              <div className="text-sm text-gray-500">Stocks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">300+</div>
              <div className="text-sm text-gray-500">Predictions Made</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Daily</div>
              <div className="text-sm text-gray-500">AI Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">5 Days</div>
              <div className="text-sm text-gray-500">Memory Window</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 mb-8">Analyzing news from leading financial sources</p>
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
          <p className="text-xl max-w-2xl mx-auto leading-relaxed"> This experiment is free for everybody. If you want to support the project, you can {''} 
          <a href="https://buymeacoffee.com/taratdev" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 underline text-green-500">buy me a coffee ☕</a></p>
        </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xl">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Collect News Daily</h3>
                <p className="text-gray-600">Every day, the system fetches news articles about your selected stocks from major financial sources.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xl">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Analyzes Sentiment</h3>
                <p className="text-gray-600">Gemini AI reads the news and assigns a sentiment score (-1 to +1) based on potential stock price impact, using historical context from the past 5 days.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xl">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Track Predictions</h3>
                <p className="text-gray-600">The next day, we compare the sentiment prediction with actual price movement to measure accuracy.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xl">4</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Deliver Insights</h3>
                <p className="text-gray-600">Get a daily newsletter with AI-generated summaries and explore the performance dashboard to see how well sentiment predicts price.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="relative z-10 py-20 md:px-4 bg-gray-50" id="subscription">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Get Daily Updates</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Subscribe to receive daily AI-generated summaries of your selected stocks in your inbox
          </p>
          <div className="bg-white rounded-2xl py-12 md:p-12 shadow-sm">
            <SubscriptionForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">Why This Experiment?</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-brain text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Stateful AI System</h3>
              <p className="text-gray-600">
                Unlike typical AI, this system has memory—it considers the last 5 days of sentiment and price data when analyzing today's news.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Transparent Performance</h3>
              <p className="text-gray-600">
                Every prediction is tracked and measured. See exactly how well (or poorly) AI sentiment predicts price movements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-flask text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Open Experiment</h3>
              <p className="text-gray-600">
                This is a live experiment to understand if news sentiment has predictive power—and you can follow along in real-time.
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