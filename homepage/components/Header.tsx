'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <img 
              src="/logo.png" 
              alt="StocksBrew Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-black">StocksBrew</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="/sentiment" 
              className={`text-gray-600 hover:text-black transition-colors pb-1 ${
                pathname === '/sentiment' ? 'border-b-2 border-black text-black' : ''
              }`}
            >
              Explore
            </a>
            <a 
              href="/performance" 
              className={`text-gray-600 hover:text-black transition-colors pb-1 ${
                pathname === '/performance' ? 'border-b-2 border-black text-black' : ''
              }`}
            >
              Performance
            </a>
            <a 
              href="/demo" 
              className={`text-gray-600 hover:text-black transition-colors pb-1 ${
                pathname === '/demo' ? 'border-b-2 border-black text-black' : ''
              }`}
            >
              Demo
            </a>
          </div>
        </div>
      </div>
    </header>
  )
} 