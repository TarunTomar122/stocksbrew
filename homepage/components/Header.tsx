'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => router.push('/')}>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="StocksBrew Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-black">StocksBrew</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <a href="/explore" className="text-gray-600 hover:text-black transition-colors">
              Explore
            </a>
            <button 
              onClick={() => {
                const subscriptionSection = document.getElementById('subscription')
                if (subscriptionSection) {
                  subscriptionSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 